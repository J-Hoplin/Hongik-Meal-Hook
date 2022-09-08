Weather Hook for Discord and Slack
===
***
**[Discord](https://discord.com/)와 [Slack](https://slack.com/intl/ko-kr/) 플랫폼을 위한 홍익대학교 학식정보 웹훅 소스코드입니다**
***
## JavaScript Dependecies

- axios 
- node-scheduler
***
## Dockerfile execution infromation

- Base Image : Node v16
- Working Directory : /apps
- Exported container volume
    - /apps

```bash
docker build -t (image name) .
```
```
docker run -it -d -v $(pwd):/apps --name (container name) (image name) bash
```
```
docker exec -it (container name) bash
```
```
# In container : Consider as after you enter your webhook endpoint to config

# Discord
npm run run-discord 
# Slack
npm run run-slack
```
***
## How to use?

**You need to set scheduler expression with cron-tab in config.json**

1. git clone this project 

```bash
git clone https://github.com/J-hoplin1/Hongik-Meal-Hook.git
```

2. Enter your discord / slack webhook endpoint

3. Execute source code

```bash
# Discord
npm run run-discord 
# Slack
npm run run-slack
```
