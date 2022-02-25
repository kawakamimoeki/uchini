import sourceMap from 'source-map'
import sass from 'sass'
import { CollectSelectorsInteractor } from '../interactors/collect_selectors_interactor'

/**
 * List CSS selectors usage
 */
export class LsUsecase {
  /**
   * @param {string} scss
   * @param {string} content
   * @param {boolean} unusedOnly
   */
  constructor (scss, content, unusedOnly) {
    this.scss = scss
    this.content = content
    this.unusedOnly = unusedOnly
  }

  /**
   * @returns {Promise<void>}
   */
  async call () {
    const compiled = sass.compile(this.scss, { style: 'compressed', sourceMap: true, logger: sass.Logger.silent })
    const consumer = await new sourceMap.SourceMapConsumer(compiled.sourceMap)
    return await new CollectSelectorsInteractor(compiled.css, this.content, consumer).call()
  }
}
