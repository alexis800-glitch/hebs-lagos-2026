/**
 * Page titles for the 2027 staging pages, behind the same gate as
 * app/2027/layout.tsx: a withheld page carries no 2027 metadata at all, so its
 * production 404 says nothing about 2027.
 */
import type { Metadata } from "next";
import { previewStatuses } from "../content/2027";
import { deployEnvironment, isPagePublishable } from "../publication";

export function stagingMetadata(title: string): Metadata {
  if (!isPagePublishable(previewStatuses(), deployEnvironment())) return {};
  return { title };
}
