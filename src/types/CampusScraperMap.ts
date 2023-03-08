import SupportedCampus from "./SupportedCampus";
import Scraper from "../app/scraper";

type CampusScraperMap = { [key in SupportedCampus]?: Scraper }
export default CampusScraperMap