import Day1 from 'container/Day1'
import Day2 from 'container/Day2'
import Day3 from 'container/Day3'
import Day4 from 'container/Day4'
import Day5 from 'container/Day5'
import Day6 from 'container/Day6'
import Day7 from 'container/Day7'
import Day8 from 'container/Day8'
import Day9 from 'container/Day9'
import Day10 from 'container/Day10'
import Day11 from 'container/Day11'
import Day12 from 'container/Day12'
import Day13 from 'container/Day13'
import Day14 from 'container/Day14'
import Day15 from 'container/Day15'
import Day16 from 'container/Day16'
import Day17 from 'container/Day17'
import Day18 from 'container/Day18'
import Day19 from 'container/Day19'
import Day20 from 'container/Day20'
import Day21 from 'container/Day21'
import Day22 from 'container/Day22'
import Day23 from 'container/Day23'
import Day24 from 'container/Day24'
import Day25 from 'container/Day25'
import Day26 from 'container/Day26'
import Day27 from 'container/Day27'
import Day28 from 'container/Day28'
import Day29 from 'container/Day29'
import Day30 from 'container/Day30'

import HSBCDemo1 from 'container/HSBCDemo1'
import HSBCDemo2 from 'container/HSBCDemo2'
import HSBCDemo3 from 'container/HSBCDemo3'
import HSBCDemo4 from 'container/HSBCDemo4'


const outDayRoutes = () => {

  let output = []
  let container = [
    Day1,
    Day2,
    Day3,
    Day4,
    Day5,
    Day6,
    Day7,
    Day8,
    Day9,
    Day10,
    Day11,
    Day12,
    Day13,
    Day14,
    Day15,
    Day16,
    Day17,
    Day18,
    Day19,
    Day20,
    Day21,
    Day22,
    Day23,
    Day24,
    Day25,
    Day26,
    Day27,
    Day28,
    Day29,
    Day30
  ]

  let counter = 0
  container.forEach( c => {
    let d = String( counter + 1 )

    output.push({
      path: '/day/' + d,
      component: c
    })

    counter++
  })


  let hsbcContainer = [
    HSBCDemo1,
    HSBCDemo2,
    HSBCDemo3,
    HSBCDemo4
  ]

  let hsbcCounter = 0
  hsbcContainer.forEach( c => {

    let ver = String( hsbcCounter + 1 )

    output.push({
      path: '/hsbc/demo/' + ver,
      component: c
    })

    hsbcCounter++
  })

  return output
}

module.exports = outDayRoutes()
