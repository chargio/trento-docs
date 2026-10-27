// SPDX-FileCopyrightText: SUSE LLC
// SPDX-License-Identifier: Apache-2.0

// Mobile search toggle for the header in partials/header-content.hbs.
// The navbar menu itself is toggled by the default UI (js/site.js); the search
// field and the menu are kept mutually exclusive.
;(function () {
  'use strict'

  var navbarBurger = document.querySelector('.navbar-burger')
  var searchField = document.getElementById('search-wrapper')
  if (!navbarBurger || !searchField) return
  document.getElementById('search-close').addEventListener('click', toggleSearch)
  document.querySelector('.search-toggle').addEventListener('click', toggleSearch)
  navbarBurger.addEventListener('click', function () {
    searchField.classList.add('hidden')
  })

  function toggleSearch (e) {
    e.stopPropagation()
    if (navbarBurger.classList.contains('is-active')) navbarBurger.click()
    searchField.classList.toggle('hidden')
  }
})()
