import DeployImageResponse from '@/photo/image-response/DeployImageResponse';
import { getPhotos } from '@/services/postgres';
import { GRID_OG_WIDTH, GRID_OG_HEIGHT } from '@/site';
import { FONT_FAMILY_IBM_PLEX_MONO, getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from '@vercel/og';

const DEBUG_CACHING: boolean = false;

export const runtime = 'edge';

export async function GET(request: Request) {
  const photos = await getPhotos('priority');
  const fontData = await getIBMPlexMonoMedium();
  
  return new ImageResponse(
    (
      <DeployImageResponse {...{
        photos,
        request,
        width: GRID_OG_WIDTH,
        height: GRID_OG_HEIGHT,
        fontFamily: FONT_FAMILY_IBM_PLEX_MONO,
      }}/>
    ),
    {
      width: GRID_OG_WIDTH,
      height: GRID_OG_HEIGHT,
      fonts: [
        {
          name: FONT_FAMILY_IBM_PLEX_MONO,
          data: fontData,
          style: 'normal',
        },
      ],
      ...!DEBUG_CACHING && {
        headers: {
          'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
      },
    },
  );
}
