import Crowi from 'server/crowi'
import { Express } from 'express'
import ssr from './ssr'

export default (crowi: Crowi, app: Express, req, res) => {
  // const debug = Debug('crowi:lib:swigFunctions')
  const Page = crowi.model('Page')
  const Config = crowi.model('Config')
  const User = crowi.model('User')
  const { locals } = res

  // token getter
  locals.csrf = function() {
    return req.csrfToken
  }

  locals.assets = function(file) {
    // tmp
    return file
  }

  locals.googleLoginEnabled = function() {
    const config = crowi.getConfig()
    return Config.googleLoginEnabled(config)
  }

  locals.githubLoginEnabled = function() {
    const config = crowi.getConfig()
    return Config.githubLoginEnabled(config)
  }

  locals.searchConfigured = function() {
    if (crowi.getSearcher()) {
      return true
    }
    return false
  }

  locals.slackConfigured = function() {
    var config = crowi.getConfig()
    if (Config.hasSlackToken(config)) {
      return true
    }
    return false
  }

  locals.isUploadable = function() {
    var config = crowi.getConfig()
    return Config.isUploadable(config)
  }

  locals.isExternalShareEnabled = function() {
    var config = crowi.getConfig()
    return config.crowi['app:externalShare']
  }

  locals.parentPath = function(path) {
    if (path == '/') {
      return path
    }

    if (path.match(/.+\/$/)) {
      return path
    }

    return path + '/'
  }

  locals.isUserPageList = function(path) {
    if (path.match(/^\/user\/[^/]+\/$/) || path.match(/^\/user\/$/)) {
      return true
    }

    return false
  }

  locals.isUserPage = function(path) {
    return path.match(/^\/user\/[^/]+$/)
  }

  locals.isTopPage = function() {
    var path = req.path || ''
    if (path === '/') {
      return true
    }

    return false
  }

  locals.isTrashPage = function() {
    var path = req.path || ''
    if (path.match(/^\/trash\/.*/)) {
      return true
    }

    return false
  }

  locals.isDeletablePage = function() {
    var Page = crowi.model('Page')
    var path = req.path || ''

    return Page.isDeletableName(path)
  }

  locals.userPageRoot = function(user) {
    if (!user || !user.username) {
      return ''
    }
    return '/user/' + user.username
  }

  locals.css = {
    grant: function(pageData) {
      if (!pageData) {
        return ''
      }

      switch (pageData.grant) {
        case Page.GRANT_PUBLIC:
          return 'grant-public'
        case Page.GRANT_RESTRICTED:
          return 'grant-restricted'
        // case Page.GRANT_SPECIFIED:
        //  return 'grant-specified';
        //  break;
        case Page.GRANT_OWNER:
          return 'grant-owner'
        default:
          break
      }
      return ''
    },
    userStatus: function(user) {
      // debug('userStatus', user._id, user.usename, user.status);

      switch (user.status) {
        case User.STATUS_REGISTERED:
          return 'badge-info'
        case User.STATUS_ACTIVE:
          return 'badge-success'
        case User.STATUS_SUSPENDED:
          return 'badge-warning'
        case User.STATUS_DELETED:
          return 'badge-danger'
        case User.STATUS_INVITED:
          return 'badge-info'
        default:
          break
      }
      return ''
    },
  }

  locals.Component = ssr(res)
}
