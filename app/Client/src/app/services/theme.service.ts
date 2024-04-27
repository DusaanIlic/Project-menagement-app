import {Injectable} from "@angular/core";
import themes from "../../assets/themes.json";
import { Theme } from "../models/theme";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  getThemeOptions() {
    const options: Theme[] = themes;
    return of(options);
  }

  setTheme(theme: string) {

  }
}
