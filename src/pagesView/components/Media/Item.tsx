import { Messenger } from '@estruyf/vscode/dist/client';
import { ClipboardCopyIcon } from '@heroicons/react/outline';
import { basename, dirname } from 'path';
import * as React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MediaInfo } from '../../../models/MediaPaths';
import { DashboardMessage } from '../../DashboardMessage';
import { LightboxAtom, SettingsSelector } from '../../state';

export interface IItemProps {
  media: MediaInfo;
}

export const Item: React.FunctionComponent<IItemProps> = ({media}: React.PropsWithChildren<IItemProps>) => {
  const settings = useRecoilValue(SettingsSelector);
  const [ , setLightbox ] = useRecoilState(LightboxAtom);

  const parseWinPath = (path: string | undefined) => {
    return path?.split(`\\`).join(`/`);
  }

  const getFolder = () => {
    if (settings?.wsFolder && media.fsPath) {
      let relPath = media.fsPath.split(settings.wsFolder).pop();

      if (settings.staticFolder && relPath) {
        relPath = relPath.split(settings.staticFolder).pop();
      }

      return dirname(parseWinPath(relPath) || "");
    }
    return "";
  };

  const copyToClipboard = () => {
    let relPath: string | undefined = "";
    if (settings?.wsFolder && media.fsPath) {
      relPath = media.fsPath.split(settings.wsFolder).pop();

      if (settings.staticFolder && relPath) {
        relPath = relPath.split(settings.staticFolder).pop();
      }
    }

    Messenger.send(DashboardMessage.copyToClipboard, parseWinPath(relPath) || "");
  };

  const calculateSize = () => {
    if (media?.stats?.size) {
      const size = media.stats.size / (1024*1024);
      if (size > 1) {
        return `${size.toFixed(2)} MB`;
      } else {
        return `${(size * 1024).toFixed(2)} KB`;
      }
    }
  };

  const openLightbox = () => {
    setLightbox(media.vsPath || "");
  };

  return (
    <li className="group relative bg-gray-50 dark:bg-vulcan-200 hover:shadow-xl dark:hover:bg-vulcan-100">
      <button className="bg-white block w-full aspect-w-10 aspect-h-7 overflow-hidden cursor-pointer" onClick={openLightbox}>
        <img src={media.vsPath} alt={basename(media.fsPath)} className="mx-auto object-cover" />
      </button>
      <div className={`relative py-4 pl-4 pr-10`}>
        <div className={`absolute top-4 right-4`}>
          <button title={`Copy media path`} 
                  className={`hover:text-teal-900 focus:outline-none`} 
                  onClick={copyToClipboard}>
            <ClipboardCopyIcon className={`h-5 w-5`} />
            <span className={`sr-only`}>Copy media path</span>
          </button>
        </div>
        <p className="text-sm dark:text-whisper-900 font-bold pointer-events-none flex items-center">
          {basename(parseWinPath(media.fsPath) || "")}
        </p>
        <p className="mt-2 text-sm dark:text-whisper-900 font-medium pointer-events-none flex items-center">
          <b className={`mr-2`}>Folder:</b> {getFolder()}
        </p>
        {
          media?.stats?.size && (
            <p className="mt-2 text-sm dark:text-whisper-900 font-medium pointer-events-none flex items-center">
              <b className={`mr-1`}>Size:</b> {calculateSize()}
            </p>
          )
        }
      </div>
    </li>
  );
};