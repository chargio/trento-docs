// SPDX-FileCopyrightText: SUSE LLC
// SPDX-License-Identifier: Apache-2.0

"use strict";

const { register, _test } = require("./unpublish-partials.cjs");

function buildPage(relative, version = "latest") {
  return {
    src: { component: "ROOT", version, module: "user-guide", relative },
    out: { path: `user-guide/${relative.replace(/\.adoc$/, ".html")}` },
  };
}

function buildCatalog(pages) {
  return { getPages: (filter) => pages.filter(filter) };
}

describe("unpublish-partials", () => {
  test("unpublishes pages under partials/ in every version", () => {
    const pages = [
      buildPage("partials/mcp-host-prerequisites.adoc", "latest"),
      buildPage("partials/mcp-host-prerequisites.adoc", ""),
      buildPage("partials/nested/supported-versions.adoc", ""),
    ];

    _test.unpublishPartials(buildCatalog(pages));

    for (const page of pages) expect(page).not.toHaveProperty("out");
  });

  test("keeps regular pages published", () => {
    const page = buildPage("trento-mcp-host-sles.adoc");
    const out = page.out;

    _test.unpublishPartials(buildCatalog([page]));

    expect(page.out).toBe(out);
  });

  test("only matches partials/ at the start of the page path", () => {
    expect(_test.isPublishedPartial(buildPage("partials/a.adoc"))).toBe(true);
    expect(_test.isPublishedPartial(buildPage("guide/partials/a.adoc"))).toBe(
      false,
    );
    expect(_test.isPublishedPartial(buildPage("partials-overview.adoc"))).toBe(
      false,
    );
  });

  test("ignores pages that are already unpublished", () => {
    const page = buildPage("partials/a.adoc");
    delete page.out;

    expect(_test.isPublishedPartial(page)).toBe(false);
  });

  test("runs once on contentClassified", () => {
    const page = buildPage("partials/a.adoc");
    const context = { once: jest.fn() };

    register.call(context);

    expect(context.once).toHaveBeenCalledTimes(1);
    const [eventName, listener] = context.once.mock.calls[0];
    expect(eventName).toBe("contentClassified");
    listener({ contentCatalog: buildCatalog([page]) });
    expect(page).not.toHaveProperty("out");
  });
});
