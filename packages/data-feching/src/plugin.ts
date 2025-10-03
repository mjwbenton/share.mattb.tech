import { Plugin } from "unified";
import { u } from "unist-builder";
import { parse } from "acorn";

const DATA_PROVIDERS = "dataProviders";
const PATHS_PROVIDER = "pathsProvider";

const plugin: Plugin<
  [
    {
      globalDataProviders?: string[];
    },
  ]
> = ({ globalDataProviders = [] } = {}) => {
  return (tree, file) => {
    const pageMeta = (file.data as any)?.pageMeta ?? {};
    const dataProviders = [
      ...globalDataProviders,
      ...(pageMeta[DATA_PROVIDERS] ?? []),
    ];
    const pathsProvider = pageMeta[PATHS_PROVIDER] ?? null;

    const runtimeImport = `import { dataProviderRuntime, pathsProviderRuntime } from "@mattb.tech/data-fetching"`;
    const importRuntimeNode = u(
      "mdxjsEsm",
      {
        data: {
          estree: parse(runtimeImport, {
            ecmaVersion: "latest",
            sourceType: "module",
          }),
        },
      },
      runtimeImport,
    );

    const importDataProviderNodes = dataProviders.flatMap((provider, i) => {
      const importStr = `import _dp${i} from "${provider}"`;
      return u(
        "mdxjsEsm",
        {
          data: {
            estree: parse(importStr, {
              ecmaVersion: "latest",
              sourceType: "module",
            }),
          },
        },
        importStr,
      );
    });

    const getStaticPropsExport = `export const getStaticProps = async () => {
        const pageMeta = ${JSON.stringify(pageMeta)};
        return await dataProviderRuntime(pageMeta, [${dataProviders
          .map((_, i) => `_dp${i}`)
          .join(", ")}])
      }`;
    const getStaticPropsNode = u(
      "mdxjsEsm",
      {
        data: {
          estree: parse(getStaticPropsExport, {
            ecmaVersion: "latest",
            sourceType: "module",
          }),
        },
      },
      getStaticPropsExport,
    );

    const importPathProvider = pathsProvider
      ? `import _pp from "${pathsProvider}"`
      : null;
    const importPathProviderNode = importPathProvider
      ? u(
          "mdxjsEsm",
          {
            data: {
              estree: parse(importPathProvider, {
                ecmaVersion: "latest",
                sourceType: "module",
              }),
            },
          },
          importPathProvider,
        )
      : null;

    const getStaticPathsExport = `export const getStaticPaths = async () => {
      const pageMeta = ${JSON.stringify(pageMeta)};
      return await pathsProviderRuntime(pageMeta, _pp);
    }`;
    const getStaticPathsExportNode = u(
      "mdxjsEsm",
      {
        data: {
          estree: parse(getStaticPathsExport, {
            ecmaVersion: "latest",
            sourceType: "module",
          }),
        },
      },
      getStaticPathsExport,
    );

    (tree as any).children = [
      importRuntimeNode,
      ...importDataProviderNodes,
      getStaticPropsNode,
      ...(importPathProviderNode ? [importPathProviderNode] : []),
      ...(pathsProvider ? [getStaticPathsExportNode] : []),
      ...(tree as any).children,
    ];
  };
};

export default plugin;
