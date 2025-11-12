import inquirer from "inquirer";
import type { Difficulty } from "./types.js";
import { EASY, MEDIUM, HARD } from "./const.js";

export async function selectDifficulty(): Promise<Difficulty> {
    const { level } = await inquirer.prompt([
      {
        type: "list",
        name: "level",
        message: "Choose difficulty level:",
        choices: [EASY, MEDIUM, HARD] as const,
      },
    ]);
    return level;
  }