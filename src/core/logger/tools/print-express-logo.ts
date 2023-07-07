import { printLogo } from './print-logo'

const DEFAULT_LOGO = `
  _____                              
 | ____|_  ___ __  _ __ ___  ___ ___ 
 |  _| \\ \\/ / '_ \\| '__/ _ \\/ __/ __|
 | |___ >  <| |_) | | |  __/\\__ \\__ \\
 |_____/_/\\_\\ .__/|_|  \\___||___/___/
            |_|                      

     Express Backend
  `

export function printExpressLogo(logo = DEFAULT_LOGO) {
  printLogo(logo)
}
