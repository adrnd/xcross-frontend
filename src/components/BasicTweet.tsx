// server‐side shape
interface RawTweet {
  TweetId:    string
  Account:    string
  TweetText:  string
  Date:       string
  ProfilePic: string
  MediaURL?: string
}

// your app’s shape (you can rename fields or drop ones you don’t need)
type BasicTweet = {
  tweetID:           string
  account:  string
  date:         string
  tweetText:    string
  profilepicURL:string
  mediaURL?: string
}
export default BasicTweet