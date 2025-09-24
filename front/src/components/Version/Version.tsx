'use client';

import { MdNewReleases } from 'react-icons/md';

import { compareVersions, validate } from 'compare-versions';
import cache from 'memory-cache';
import useSWR from 'swr';

const LATEST_RELEASE_CACHE_KEY = 'latestRelease';

type VersionProps = {
  disableUpdateCheck?: boolean;
};

export default function Version({ disableUpdateCheck = false }: VersionProps) {
  const buildTime = process.env.NEXT_PUBLIC_BUILDTIME?.length
    ? process.env.NEXT_PUBLIC_BUILDTIME
    : new Date().toISOString();

  const revision = process.env.NEXT_PUBLIC_REVISION?.length
    ? process.env.NEXT_PUBLIC_REVISION
    : 'dev';

  const version = process.env.NEXT_PUBLIC_VERSION?.length
    ? process.env.NEXT_PUBLIC_VERSION
    : 'dev';

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
  };

  let latestRelease = cache.get(LATEST_RELEASE_CACHE_KEY);

  const { data: releaseData } = useSWR(
    latestRelease || disableUpdateCheck ? null : '/api/releases'
  );

  if (releaseData) {
    latestRelease = releaseData?.[0];
    cache.put(LATEST_RELEASE_CACHE_KEY, latestRelease, 3600000);
  }

  return (
    <div id="version" className="flex flex-row items-center">
      <span className="text-xs text-gray-600 dark:text-gray-300">
        {version === 'main' || version === 'dev' || version === 'nightly' ? (
          <>
            {version} ({revision.substring(0, 7)}, {formatDate(buildTime)})
          </>
        ) : (
          <a
            href={`https://github.com/ifpebj-ti/horas-discentes/releases/tag/${version}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-xs text-gray-600 dark:text-gray-300 flex flex-row items-center"
          >
            {version} ({revision.substring(0, 7)}, {formatDate(buildTime)})
          </a>
        )}
      </span>

      {validate(version) &&
        releaseData &&
        latestRelease &&
        compareVersions(latestRelease.tag_name, version) > 0 && (
          <a
            href={latestRelease.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-xs text-red-500 flex flex-row items-center"
          >
            <MdNewReleases className="mr-1" /> Atualização disponível
          </a>
        )}
    </div>
  );
}
