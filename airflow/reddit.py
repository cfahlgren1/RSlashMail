import praw
import json
import os
from dotenv import load_dotenv
load_dotenv()
reddit = praw.Reddit(client_id=os.environ.get('CLIENT_ID'), client_secret=os.environ.get('CLIENT_SECRET'), user_agent=os.environ.get('USER_AGENT'),
                     password=os.environ.get('PASSWORD'),  username=os.environ.get('USERNAME'))

subreddits = ['wallstreetbets', 'funny', 'memes']

data = {
    "subreddits": [
        
    ]
}

x = 0
for subreddit in subreddits:
    data.get('subreddits').append({"name": subreddit, "posts": []})
    for submission in reddit.subreddit(subreddit).hot(limit=5):
        data.get('subreddits')[x].get('posts').append({'author': submission.author.name, 'selftext': submission.selftext, 'permalink': submission.permalink, 'url': submission.url, 'score': submission.score, 'created_utc': submission.created_utc})
    x+=1

finalData = (json.dumps(data, indent=2))