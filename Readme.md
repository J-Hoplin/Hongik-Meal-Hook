Hongik Univ. Sejong Meal-Hook for Discord and Slack
===
***
**[Discord](https://discord.com/)플랫폼의 홍익대학교 학식정보 웹훅 소스코드입니다**
***
## How to use?

1. git clone this project 

    ```bash
    git clone https://github.com/J-hoplin1/Hongik-Meal-Hook.git
    ```

2. Complete application config. Yet sejong campus supported

    - scheduler : Crontab Expression
    - hook : Please follow format as under below. You can view supported types of campus [here](./src/types/SupportedCampus.ts)
        ```json
        ...
        "hook": [
            {
                "hook" : "Your discord web hook endpoint",
                "campus" : "Supported Campus"
            }
        ]
        ...
        ```
    - JSON under below is example of config file
        ```json
        {
            "scheduler": "30 10 * * *",
            "hook": [
                {
                    "hook": "discord hook url",
                    "campus": "sejong"
                }
            ]
        }
        ```
3. Build docker
    ```bash
    docker build -t (image name) .
    ```
4. Run docker container.
    - Mountable container volume
        - /app/dist/logfile : logfiles directory
    ```bash
    docker run -d --name (container name) -e -v (location you want to mount):/app/dist/logfile (image name)
    ```
***
## How to contribute?
I'm planning to add support for Seoul Campus in the future, but if you want to make a contribution before the next update, please make Pull Request according to the following provisions.

1. Add campus scraper's file in `src/app`

2. Write and export campus' scraper file. **You need to make class that extends `Scraper` abstract class which is located in `src/app/scraper.ts`
    - You need to implement abstract method `scrape()`, which is async function and return [MealProcess](./src/types/MealProcess.ts) type

    ```typescript
    class SeoulCampus extends Scraper {
        constructor() {
            super()
        }
        public async scrape(): Promise<MealProcess> {
            // implement method
        }
    }

    export default SeoulCampus
    ```

3. Add campus name in [`SupportedCampus`](./src/types/SupportedCampus.ts) as **union type**
    ```typescript
    type SupportedCampus = 'sejong' | (campus name to add)
    ```

4. Add campus and it's scraper instance in [discord.ts](./src/platform/disocrd.ts). **key should be same name you've write in step 3** and value should be instance that extend Scraper
    ```typescript
    const scrapers: CampusScraperMap = {
        sejong: new SejongScrape(),
        (campus name): new ("Some scraper class")()
    }
    ```

5. Other types of PR is also welcome.