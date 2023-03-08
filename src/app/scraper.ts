import { MealProcess } from "../types"

abstract class Scraper {
    protected endpoint!: string

    /**
     * 추상 클래스 추상 메소드에서는 async 키워드를 사용할 수 없다.
     * 
     * 이런 경우에는, 반환타입을 Promise<Type> 를 반환타입으로 지정한다
     * 
     * 그러면 자동으로 비동기 함수임을 인지한다.
     */
    public abstract scrape(): Promise<MealProcess>
}

export default Scraper