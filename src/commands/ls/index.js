import {Command, Flags} from '@oclif/core'
import fs from 'fs'
import { LsUsecase } from '../../usecases/ls_usecase'

/**
 * List CSS selectors usage
 */
export default class Ls extends Command {
  static description = 'List CSS selectors usage'

  static examples = ['$ csssu ls --css path/to/css --content path/to/content --output path/to/output --unusedOnly']

  static flags = {
    scss: Flags.string({description: 'Path to CSS file', required: true}),
    content: Flags.string({description: 'Path to content file', required: true}),
    output: Flags.string({description: 'Path to output file', required: false}),
    unusedOnly: Flags.boolean({description: 'Unused selectors only'})
  }

  async run() {
    const { args, flags } = await this.parse(Ls)

    const analyzer = new LsUsecase(flags.scss, flags.content, flags.unusedOnly)
    const results = await analyzer.call()

    if (flags.output) {
      fs.writeFileSync(flags.output, JSON.stringify(results, null, 2))
    } else {
      console.dir(results, { maxArrayLength: null })
    }
  }
}
