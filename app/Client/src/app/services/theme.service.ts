import {Injectable} from "@angular/core";
import themes from "../../assets/themes.json";
import { Theme } from "../models/theme";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  getThemeOptions() {
    const options: Theme[] = themes;
  }

  setTheme(theme: Theme) {

  }
}
