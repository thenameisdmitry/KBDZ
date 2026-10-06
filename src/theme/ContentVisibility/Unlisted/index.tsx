import React, {type ReactNode} from 'react';
import {UnlistedMetadata} from '@docusaurus/theme-common';

/**
 * Swizzled from @docusaurus/theme-classic.
 *
 * The stock component renders two things: UnlistedMetadata, which emits the
 * `noindex, nofollow` robots meta tag, and a visible "Unlisted page" caution
 * banner at the top of the page.
 *
 * We keep the metadata, because that is what actually keeps the page out of
 * search engines, and drop the banner, which is noise for someone opening the
 * page from a direct link.
 */
export default function Unlisted(): ReactNode {
  return <UnlistedMetadata />;
}
