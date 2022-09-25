/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common'
import { COLOR } from '../constants'
import { LoggerService } from '../logger.service'

const logger = LoggerService.getInstance('logger')

export async function printLogo(app: INestApplication) {
  logger.trace('')

  const serviceInfo = `
                                 $@@.
                                  $@@@  @@,
                                   ]@@"g@@@@g
                                   @,@@@@@@@@@
                ,ggg&@@@@@@BNggg,  P@@@@@@@@@@@
            ,g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@K
          g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@P   ,
       ,g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    @@g
 ,g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"   g@@@@
$@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@P   g@@@@@@@p
]@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@PP'  ,g@@@@@@@@@@@p
  ]@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@p
    MB@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
     * @"          "PB@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                       "N@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                          %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                            $@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                             %@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
               ,ggg           $@@@@@B@@@@@@@@@@@@@@@@@@@@@@P
              @@@@@        g@Np@@@@@ @@@@@@@@@@@@@@@@@R@@@@
              @@@@@@    @g@@@@@@@@@  @@@@@@@@@@@@@@@@@ @@@
              ]@@@@@@@@@@@@@@@@@@P  ]@@@@@@@@@@@@@@@@P $@
               "B@@@@@@@@@@@@@@P   ,@@@@@@@@@@@@@@@@P  P
               "PB@@@@@@@@BPP     g@@@@@@@@@@@P]@@@P
                                ,@@@@B@@@@@@P  @@P
                               ""  ,g@@@@@P  ,@P'
     NestJS Base Backend         ,@@@@@P-   7P
                              ,@@@P-
  `
  process.stderr.write(`${COLOR.LIGHT_GREY}${serviceInfo}${COLOR.RESET}\n`)
}
