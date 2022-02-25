import path from 'path'
import selectorParser from 'postcss-selector-parser'
import { PurgeCSS } from 'purgecss'
import { Selector } from '../entities/selector'

/**
 * Collect Selectors
 */
export class CollectSelectorsInteractor {
  /**
   * @param {string} css
   * @param {string} content
   * @param {object} consumer
   */
  constructor (css, content, consumer) {
    this.css = css
    this.content = content
    this.consumer = consumer
  }

  /**
   * @returns {Array}
   */
  async call () {
    const purgedResults = await new PurgeCSS().purge({
      content: [this.content],
      css: [{ raw: this.css }],
      rejected: true
    })

    return purgedResults[0].rejected.map((selector) => {
      const name = this.normalizeSelector(selector)
      const positions = this.selectorMatches(this.css, name).map((match) => {
        const position = this.consumer.originalPositionFor({ line: 1, column: match.index + match[0].indexOf(match[2]) })
        return `${this.relativeFilepath(position.source)}:${position.line}:${position.column}`
      })
      return new Selector(name, positions)
    })
  }

  /**
   * @param {string} selector
   * @returns {string}
   */
  normalizeSelector (selector) {
    return selectorParser().processSync(selector, { lossless: false })
  }

  /**
   * @param {string} css
   * @param {string} selector
   * @returns {Array}
   */
  selectorMatches (css, selector) {
    return [...css.matchAll(new RegExp(`(^|;|}|,)(${selector})(,|{)`, 'g'))]
  }

  /**
   *
   * @param {string} url
   * @returns {string}
   */
  relativeFilepath (url) {
    return path.relative(process.cwd(), url.replace('file://', ''))
  }
}
