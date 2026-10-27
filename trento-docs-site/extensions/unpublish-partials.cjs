// SPDX-FileCopyrightText: SUSE LLC
// SPDX-License-Identifier: Apache-2.0

"use strict";

// The user guide sources in trento/adoc are shared with the SUSE documentation
// build, so they include their partials with relative paths
// (include::partials/<file>.adoc[]). For Antora to resolve those includes, the
// collector scans trento/adoc/partials into the pages family, which would also
// publish every partial as a standalone (broken) page.
// This extension unpublishes them in every component version, so the includes
// keep working and no page is generated for the partials themselves.
// The fix lives in the playbook and not in antora.yml so that all versions
// built from their own branches (e.g. latest) behave the same.
// See https://docs.antora.org/antora/latest/extend/generator-events-reference/

const PARTIALS_DIR = "partials/";

module.exports.register = function () {
  this.once("contentClassified", ({ contentCatalog }) => {
    unpublishPartials(contentCatalog);
  });
};

function unpublishPartials(contentCatalog) {
  for (const page of contentCatalog.getPages(isPublishedPartial)) {
    delete page.out;
  }
}

function isPublishedPartial(page) {
  return Boolean(page.out) && page.src.relative.startsWith(PARTIALS_DIR);
}

module.exports._test = { unpublishPartials, isPublishedPartial };
