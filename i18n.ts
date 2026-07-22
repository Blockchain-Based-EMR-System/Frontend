import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

function getJsonFiles(dirPath: string): Record<string, string> {
  const files: Record<string, string> = {};
  
  function scanDirectory(currentPath: string) {
    const items = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);
      
      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.isFile() && item.name.endsWith('.json')) {
        const namespace = item.name.replace(/\.json$/, '');
        const relativePath = path.relative(dirPath, fullPath);
        files[namespace] = relativePath.replace(/\\/g, '/').replace(/\.json$/, '');
      }
    }
  }
  
  scanDirectory(dirPath);
  return files;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get("NEXT_LOCALE")?.value as Locale) || defaultLocale;

  const messages: Record<string, any> = {};
  
  const localeDir = path.join(process.cwd(), 'locales', locale);
  
  const jsonFiles = getJsonFiles(localeDir);

  for (const [namespace, filePath] of Object.entries(jsonFiles)) {
    messages[namespace] = (
      await import(`./locales/${locale}/${filePath}.json`)
    ).default;
  }

  return {
    locale,
    messages,
  };
});
