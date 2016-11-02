import React                      from 'react'
import Moment                     from 'moment'
import ReactDOM                   from 'react-dom'
import urljoin                    from 'url-join'
import { Router,
         applyRouterMiddleware }  from 'react-router'
import { Provider }               from 'react-redux'
import { stores, history }        from 'stores'
import { createHistory,
         useBasename }            from 'history'
import combineRoutes              from 'routes'
import RootWrapper                from 'wrapper/RootWrapper'


console.log('kaka', combineRoutes)

const rootRoutes = {
  path: '/',
  indexRoute: { onEnter: (nextState, replace) => {
    const curday = Number(Moment().date())
    replace(`/day/${curday}`)
  }},
  component: RootWrapper,
  childRoutes: combineRoutes
}


/** ReactDOM Rendering */
ReactDOM.render(
  <Provider store={stores}>
    <Router
      history={history}
      routes={rootRoutes}>
    </Router>
  </Provider>,
  document.getElementById('app__container'))
