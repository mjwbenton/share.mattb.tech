import "../src/style/index.css";
import "prismjs/themes/prism-okaidia.css";
import React from "react";
import Head from "next/head";
import Logo from "../src/global/Logo";
import Navigation from "global/Navigation";
import { DataFetchingProvider } from "@mattb.tech/data-fetching";
import { ThemeProvider } from "next-themes";
import ThemeChanger from "global/ThemeChanger";
import { PageMeta } from "pageMeta";
import { NoShareMode, isShareMode } from "utils/isShareMode";
import FourOhFour from "./404";
import ShareButton from "global/ShareButton";

const BASE_PAGE_TITLE = isShareMode() ? "share.mattb.tech" : "lonesome media";

function pageTitle(
  pageMeta?: PageMeta,
  { includeBase = true }: { includeBase?: boolean } = {},
) {
  const useTitle =
    pageMeta?.title &&
    (!isShareMode() || (isShareMode() && pageMeta?.shareEnabled));
  if (!useTitle) {
    return BASE_PAGE_TITLE;
  }
  return includeBase
    ? `${pageMeta.title} - ${BASE_PAGE_TITLE}`
    : pageMeta.title;
}

export default function MyApp({ Component, pageProps }) {
  const {
    pageMeta,
  }: {
    pageMeta?: PageMeta;
  } = pageProps;
  return (
    <>
      <Head>
        <title>{pageTitle(pageMeta)}</title>
        <meta
          name="og:title"
          content={pageTitle(pageMeta, { includeBase: false })}
        />
        {pageMeta?.description ? (
          <>
            <meta name="description" content={pageMeta.description} />
            <meta name="og:description" content={pageMeta.description} />
          </>
        ) : null}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://api.mattb.tech" />
        <link rel="preconnect" href="https://live.staticflickr.com" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          key="theme-color-light"
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#ffffff"
        />
        <meta
          key="theme-color-dark"
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#171717"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {!isShareMode() ? (
          <>
            <link rel="manifest" href="/manifest.webmanifest" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta
              name="apple-mobile-web-app-status-bar-style"
              content="default"
            />
            <meta name="apple-mobile-web-app-title" content="lonesome" />
          </>
        ) : null}
      </Head>
      <ThemeProvider attribute="class">
        <NoShareMode>
          <header className="flex relative">
            <Logo />
            <ThemeChanger />
          </header>
          <Navigation />
        </NoShareMode>
        {/* If we're in share mode and the page doesn't have sharing enabled, show a 404 (though unfortunately it'll actually return 200) */}
        {isShareMode() && !pageMeta?.shareEnabled ? (
          <FourOhFour />
        ) : (
          <>
            <main className={`relative prose dark:prose-invert m-4 md:m-8`}>
              <ShareButton shareEnabled={pageMeta?.shareEnabled} />
              <DataFetchingProvider pageProps={pageProps}>
                <Component />
              </DataFetchingProvider>
            </main>
          </>
        )}
      </ThemeProvider>
    </>
  );
}
