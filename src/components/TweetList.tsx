// TweetList.tsx
import React, { useEffect, useState } from 'react'
import type BasicTweet from './BasicTweet'


export function TweetList() {
  const [tweets, setTweets] = useState<BasicTweet[]>([])
  const WS_URL = 'ws://localhost:5013/ws'

  useEffect(() => {
    const ws = new WebSocket(WS_URL)

    ws.onmessage = (e: MessageEvent) => {
      console.log('message received')
      let arr: unknown
      try {
        // JSON is _just_ an array, not wrapped in an object
        arr = JSON.parse(e.data)
      } catch {
        console.error('Malformed JSON')
        return
      }

      if (!Array.isArray(arr)) {
        console.error('Expected top‐level array')
        return
      }

      // Map the unknown items to your BasicTweet
      const parsed = arr
        .map((raw): BasicTweet | null => {
          // runtime check: raw must be an object with the right string props
            if (
            typeof raw === 'object' && raw !== null &&
            typeof (raw as any).TweetId    === 'string' &&
            typeof (raw as any).Account    === 'string' &&
            typeof (raw as any).TweetText  === 'string' &&
            typeof (raw as any).Date       === 'string' &&
            typeof (raw as any).ProfilePic === 'string'
            // MediaURL is optional and can be string, undefined, or null
            && (
              (raw as any).MediaURL === undefined ||
              (raw as any).MediaURL === null ||
              typeof (raw as any).MediaURL === 'string'
            )
            ) {
            return {
              tweetID:      (raw as any).TweetId,
              account:      (raw as any).Account,
              tweetText:    (raw as any).TweetText,
              date:         (raw as any).Date,
              profilepicURL: (raw as any).ProfilePic,
              mediaURL:     (raw as any).MediaURL ?? undefined,
            }
            }

          console.warn('Skipping invalid tweet', raw)
          return null
        })
        // filter out any nulls, and narrow to BasicTweet[]
        .filter((t): t is BasicTweet => t !== null)

      // merge new tweets with existing ones, avoiding duplicates
      setTweets(prevTweets => {
        const existingIDs = new Set(prevTweets.map(t => t.tweetID))
        const newTweets = parsed.filter(t => !existingIDs.has(t.tweetID))
        //prepending new tweets (pre-sorted in the backend TweetStore)
        const allTweets = [...newTweets, ...prevTweets]
        return allTweets.slice(0, 40) //limit to the most recent 40 tweets
      })
    }

    ws.onerror = console.error
    ws.onclose = () => console.log('WebSocket closed')
    return () => { ws.close() }
  }, [])
//putting together the tweet cards in a masonry layout
  return (
    <div className="" >
      <h1 style={{ color: '#d52b1e', fontWeight: 1000, fontSize: '7rem', rotate: '45deg' }}>+</h1>
      <h1 className =""style={{ color: '#d52b1e', fontWeight: 800 }}>Cross Live Feeds</h1>
      <div
      className="masonry-grid"
      style={{
        columnCount: 5,
        columnGap: '1rem',
        margin: '1rem',
      }}
      >
      {tweets.map(t => (
        <div
        className="card mb-4 rounded"
        key={t.tweetID}
        style={{
          maxWidth: '100%',
          display: 'inline-block',
          width: '100%',
          marginBottom: '1rem',
          breakInside: 'avoid',
        }}
        >
        <div className="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
          {t.mediaURL && (<img src={t.mediaURL} className="img-fluid" />)}
          <a href="#!">
          <div className="mask"></div>
          </a>
        </div>
        <div className="card-title">
            <div className="card-title d-flex align-items-center" style={{ gap: '0.5rem' }}>
            <img
              src={t.profilepicURL}
              className="rounded-circle m-2 align-left"
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              alt="ProfilePic"
            />
            <h5 className="card-title font-weight-800"
            style={{ color: '#d52b1e', fontWeight: 700 }}>{t.account}</h5>
            </div>
          <h5 className="card-text mt-2 px-2">
          {t.tweetText}
          </h5>
          <div className="h6 card-text text-muted">{t.date}</div>
        </div>
        </div>
      ))}
      </div>
    </div>
  )
}
