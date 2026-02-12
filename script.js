    // Configuration
    const API_BASE = 'https://gez1c3ucte.execute-api.us-east-2.amazonaws.com/prod';
    const MAX_SONGS = 6;

    // Fresh download URL helper
    async function downloadVideo(jobId) {
        try {
            showToast('Preparing download...', 'success');
            const response = await fetch(`${API_BASE}/jobs/${jobId}/download`);

            if (!response.ok) throw new Error('Failed to get download link');

            const data = await response.json();

            const link = document.createElement('a');
            link.href = data.downloadUrl;
            link.download = `memorial_video_${jobId}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('[DOWNLOAD ERROR]', error);
            showToast('Download failed. Please try again.', 'error');
        }
    }

    // Global state
    let allVersions = [];
    let currentVersionIndex = 0;
    
    // Song Library with S3 URLs
    const SONG_LIBRARY = [
      {
        id: 'abandoned-house-115974',
        name: 'abandoned-house-115974.mp3',
        displayName: 'Abandoned House - Violin | S. Pavkin | 4:32',
        genre: 'Classical',
        duration: '4:32',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/abandoned-house-115974.mp3'
      },
      {
        id: 'ave-maria-instrumental-150536',
        name: 'ave-maria-instrumental-150536.mp3',
        displayName: 'Ave Maria - instrumental | J. Monter | 4:30',
        genre: 'Classical',
        duration: '4:30',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/ave-maria-instrumental-150536.mp3'
      },
      {
        id: 'drowning-echoes-dramatic-orchestra-345956',
        name: 'drowning-echoes-dramatic-orchestra-345956.mp3',
        displayName: 'Drowning Echoes | L. Timachev | 1:35',
        genre: 'Classical',
        duration: '1:35',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/drowning-echoes-dramatic-orchestra-345956.mp3'
      },
      {
        id: 'farewell-to-w-111721',
        name: 'farewell-to-w-111721.mp3',
        displayName: 'Farwell to W | Jan Semmler| 1:56',
        genre: 'Classical',
        duration: '1:56',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/farewell-to-w-111721.mp3'
      },
      {
        id: 'funeral-165257',
        name: 'funeral-165257.mp3',
        displayName: 'Funeral | A. Chubarova | 1:39',
        genre: 'Classical',
        duration: '1:39',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/funeral-165257.mp3'
      },
      {
        id: 'funeral-memories-piano-334314',
        name: 'funeral-memories-piano-334314.mp3',
        displayName: 'Funeral Memories - Piano | O. F. Music | 2:10',
        genre: 'Classical',
        duration: '2:10',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/funeral-memories-piano-334314.mp3'
      },
      {
        id: 'lullaby-for-you-391546',
        name: 'lullaby-for-you-391546.mp3',
        displayName: 'Lullaby for You (v) | Loli Valiente | 3:10',
        genre: 'Pop/Folk/Celtic',
        duration: '3:10',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/lullaby-for-you-391546.mp3'
      },
      {
        id: 'beethoven-sonata-no14-op-27-moonlight-sonata-14237',
        name: 'beethoven-sonata-no14-op-27-moonlight-sonata-14237.mp3',
        displayName: 'Moonlight Sonata | Beethoven | 5:25',
        genre: 'Classical',
        duration: '5:25',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/beethoven-sonata-no14-op-27-moonlight-sonata-14237.mp3'
      },
      {
        id: 'pachelbelx27s-canon-canon-in-d-307319',
        name: 'pachelbelx27s-canon-canon-in-d-307319.mp3',
        displayName: 'Pachelbel\'s Canon (in D) | C. Clavier | 2:41',
        genre: 'Classical',
        duration: '2:41',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/pachelbelx27s-canon-canon-in-d-307319.mp3'
      },
      {
        id: 'pathetique-sonata-beethoven-350778',
        name: 'pathetique-sonata-beethoven-350778.mp3',
        displayName: 'Pathetique Sonata - Beethoven | J. Chauvel | 5:03',
        genre: 'Classical',
        duration: '5:03',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/pathetique-sonata-beethoven-350778.mp3'
      },
      {
        id: 'chopin-prelude-in-e-minor-165243',
        name: 'chopin-prelude-in-e-minor-165243.mp3',
        displayName: 'Prelude in e-minor | Chopin | 1:55',
        genre: 'Classical',
        duration: '1:55',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/chopin-prelude-in-e-minor-165243.mp3'
      },
      {
        id: 'remember-116568',
        name: 'remember-116568.mp3',
        displayName: 'Remember | Sergii Pavkin | 3:52',
        genre: 'Classical',
        duration: '3:52',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/remember-116568.mp3'
      },
      {
        id: 'sad-moment-sad-and-melancholy-piano-background-music-124488',
        name: 'sad-moment-sad-and-melancholy-piano-background-music-124488.mp3',
        displayName: 'Sad Moment | Oleg Fedak | 2:39',
        genre: 'Classical',
        duration: '2:39',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/sad-moment-sad-and-melancholy-piano-background-music-124488.mp3'
      },
      {
        id: 'sad-violin-150146',
        name: 'sad-violin-150146.mp3',
        displayName: 'Sad Violin | A. Chubarova | 1:56',
        genre: 'Classical',
        duration: '1:56',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/sad-violin-150146.mp3'
      },
      {
        id: 'country-background-349052',
        name: 'country-background-349052.mp3',
        displayName: 'Country Background - acoustic | T. Tank | 2:03',
        genre: 'Country',
        duration: '2:03',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/country-background-349052.mp3'
      },
      {
        id: 'country-rodeo-cowboy-ballad-music-full-351039',
        name: 'country-rodeo-cowboy-ballad-music-full-351039.mp3',
        displayName: 'Country Ballad - acoustic | U. Catch | 3:27',
        genre: 'Country',
        duration: '3:27',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/country-rodeo-cowboy-ballad-music-full-351039.mp3'
      },
      {
        id: 'dust-and-memory-420131',
        name: 'dust-and-memory-420131.mp3',
        displayName: 'Dust and Memory - acoustic | S. Koushik | 3:02',
        genre: 'Country',
        duration: '3:02',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/dust-and-memory-420131.mp3'
      },
      {
        id: 'empty-chair-at-the-table-250271',
        name: 'empty-chair-at-the-table-250271.mp3',
        displayName: 'Empty Chair at the Table (v) | T. Keiji | 3:26',
        genre: 'Country',
        duration: '3:26',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/empty-chair-at-the-table-250271.mp3'
      },
      {
        id: 'hands-to-heaven-318378',
        name: 'hands-to-heaven-318378.mp3',
        displayName: 'Hands to Heaven (v) | T. Keiji | 3:41',
        genre: 'Country',
        duration: '3:41',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/hands-to-heaven-318378.mp3'
      },
      {
        id: 'i-only-loved-lucy-243840',
        name: 'i-only-loved-lucy-243840.mp3',
        displayName: 'I Only Loved Lucy - acoustic | Alan Jordan | 1:51',
        genre: 'Country',
        duration: '1:51',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/i-only-loved-lucy-243840.mp3'
      },
      {
        id: 'meet-you-in-texas-243843',
        name: 'meet-you-in-texas-243843.mp3',
        displayName: 'I\'ll Meet You in Texas - guitar | Alan Jordan | 3:10',
        genre: 'Country',
        duration: '3:10',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/meet-you-in-texas-243843.mp3'
      },
      {
        id: 'in-god-we-trust-307905',
        name: 'in-god-we-trust-307905.mp3',
        displayName: 'In God We Trust (v) | Phill Buck | 4:00',
        genre: 'Country',
        duration: '4:00',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/in-god-we-trust-307905.mp3'
      },
      {
        id: 'instrumental-music-acoustic-country-193189',
        name: 'instrumental-music-acoustic-country-193189.mp3',
        displayName: 'Instrumental Acoustic Country | T. Lam | 4:12',
        genre: 'Country',
        duration: '4:12',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/instrumental-music-acoustic-country-193189.mp3'
      },
      {
        id: 'Acoustic-mix-gospel-worship-400470',
        name: 'Acoustic-mix-gospel-worship-400470.mp3',
        displayName: 'Accoustic Mix Gospel Worship | A. Poraddovsky | 5:08',
        genre: 'Gospel',
        duration: '5:08',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/Acoustic-mix-gospel-worship-400470.mp3'
      },
      {
        id: 'gospel-worship-amazing-grace-347221',
        name: 'gospel-worship-amazing-grace-347221.mp3',
        displayName: 'Amazing Grace (v) | TuneTank | 5:39',
        genre: 'Gospel',
        duration: '5:39',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/gospel-worship-amazing-grace-347221.mp3'
      },
      {
        id: 'ave-maria-vocal-417992',
        name: 'ave-maria-vocal-417992.mp3',
        displayName: 'Ave Maria (v) | N. Panek | 3:31',
        genre: 'Gospel',
        duration: '3:31',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/ave-maria-vocal-417992.mp3'
      },
      {
        id: 'cathedral-164234',
        name: 'cathedral-164234.mp3',
        displayName: 'Cathedral - Choir | A. Chubarova  | 1:25',
        genre: 'Gospel',
        duration: '1:25',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/cathedral-164234.mp3'
      },
      {
        id: 'gospel-ballad-boys-choir-humming-4216',
        name: 'gospel-ballad-boys-choir-humming-4216.mp3',
        displayName: 'Gospel Ballad Boys Choir | Juliius H. | 4:06',
        genre: 'Gospel',
        duration: '4:06',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/gospel-ballad-boys-choir-humming-4216.mp3'
      },
      {
        id: 'gospel-worship-christian-church-music-323163',
        name: 'gospel-worship-christian-church-music-323163.mp3',
        displayName: 'Gospel Worship | L. Poltavskyi | 2:13',
        genre: 'Gospel',
        duration: '2:13',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/gospel-worship-christian-church-music-323163.mp3'
      },
      {
        id: 'voices-of-eternity-church-cathedral-choir-195196',
        name: 'voices-of-eternity-church-cathedral-choir-195196.mp3',
        displayName: 'Voices of Eternity - Choir | Natalia | 2:34',
        genre: 'Gospel',
        duration: '2:34',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/voices-of-eternity-church-cathedral-choir-195196.mp3'
      },
      {
        id: 'you-restore-my-soul-413723',
        name: 'you-restore-my-soul-413723.mp3',
        displayName: 'You Restore My Soul (v) | J. Haryanto | 2:56',
        genre: 'Gospel',
        duration: '2:56',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/you-restore-my-soul-413723.mp3'
      },
      {
        id: 'across-the-oceans-269104',
        name: 'across-the-oceans-269104.mp3',
        displayName: 'Across the Oceans (v) | D. Ram | 3:49',
        genre: 'Pop/Folk/Celtic',
        duration: '3:49',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/across-the-oceans-269104.mp3'
      },
      {
        id: 'eulogy-ambient-piano-196437',
        name: 'eulogy-ambient-piano-196437.mp3',
        displayName: 'Eulogy - Ambient Piano | Liderc | 1:15',
        genre: 'Pop/Folk/Celtic',
        duration: '1:15',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/eulogy-ambient-piano-196437.mp3'
      },
      {
        id: 'farewell-full-of-love-346874',
        name: 'farewell-full-of-love-346874.mp3',
        displayName: 'Farewell Full Of Love (v) | E. Wyns | 3:46',
        genre: 'Pop/Folk/Celtic',
        duration: '3:46',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/farewell-full-of-love-346874.mp3'
      },
      {
        id: 'heart-of-the-highlands-celtic-342779',
        name: 'heart-of-the-highlands-celtic-342779.mp3',
        displayName: 'Heart of the Highlands - Celtic | P. Winter | 4:24',
        genre: 'Pop/Folk/Celtic',
        duration: '4:24',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/heart-of-the-highlands-celtic-342779.mp3'
      },
      {
        id: 'heartbroken-winter-instrumental-306095',
        name: 'heartbroken-winter-instrumental-306095.mp3',
        displayName: 'Heartbroken Winter - instrumental | S. Koushik | 3:22',
        genre: 'Pop/Folk/Celtic',
        duration: '3:22',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/heartbroken-winter-instrumental-306095.mp3'
      },
      {
        id: 'instrumental-pop-339552',
        name: 'instrumental-pop-339552.mp3',
        displayName: 'Instrumental Pop  | J. January | 3:39',
        genre: 'Pop/Folk/Celtic',
        duration: '3:39',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/instrumental-pop-339552.mp3'
      },
      {
        id: 'ki-instrumental-ambient-337501',
        name: 'ki-instrumental-ambient-337501.mp3',
        displayName: 'KI - Instrumental Ambient | S. Wurtz | 2:51',
        genre: 'Pop/Folk/Celtic',
        duration: '2:51',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/ki-instrumental-ambient-337501.mp3'
      },
      {
        id: 'life-with-you-297782',
        name: 'life-with-you-297782.mp3',
        displayName: 'Life With You - instrumental | M. Dembitsky | 2:20',
        genre: 'Pop/Folk/Celtic',
        duration: '2:20',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/life-with-you-297782.mp3'
      },
      {
        id: 'sad-song-326267',
        name: 'sad-song-326267.mp3',
        displayName: 'Sad Song | R. Dutta | 3:57',
        genre: 'Pop/Folk/Celtic',
        duration: '3:57',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/sad-song-326267.mp3'
      },
      {
        id: 'emerald-isles-celtic-342785',
        name: 'emerald-isles-celtic-342785.mp3',
        displayName: 'The Emerald Isles - Celtic | P. Winter | 3:26',
        genre: 'Pop/Folk/Celtic',
        duration: '3:26',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/emerald-isles-celtic-342785.mp3'
      },
      {
        id: 'the-hands-that-loved-me-301869',
        name: 'the-hands-that-loved-me-301869.mp3',
        displayName: 'The Hands that Loved Me (v) | S. Evans | 2:38',
        genre: 'Pop/Folk/Celtic',
        duration: '2:38',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/the-hands-that-loved-me-301869.mp3'
      },
      {
        id: 'tomorrow-144278',
        name: 'tomorrow-144278.mp3',
        displayName: 'Tomorrow - instrumental | H. Jeon | 2:06',
        genre: 'Pop/Folk/Celtic',
        duration: '2:06',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/tomorrow-144278.mp3'
      },
      {
        id: 'today-we-are-tomorrow-we-fade-1-312133',
        name: 'today-we-are-tomorrow-we-fade-1-312133.mp3',
        displayName: 'Tomorrow we Fade (v) | Jetty Jan | 3:06',
        genre: 'Pop/Folk/Celtic',
        duration: '3:06',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/today-we-are-tomorrow-we-fade-1-312133.mp3'
      },
      {
        id: 'emotional-uplifting-piano-165257',
        name: 'emotional-uplifting-piano-165257.mp3',
        displayName: 'Emotional Uplifting Piano | A. Chubarova | 2:39',
        genre: 'Uplifting',
        duration: '2:39',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/emotional-uplifting-piano-165257.mp3'
      },
      {
        id: 'friends-upbeat-instrumental-287543',
        name: 'friends-upbeat-instrumental-287543.mp3',
        displayName: 'Friends (upbeat instrumental) | M.W. Pyccnn | 2:04',
        genre: 'Uplifting',
        duration: '2:04',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/friends-upbeat-instrumental-287543.mp3'
      },
      {
        id: 'fun-happy-instrumental-342891',
        name: 'fun-happy-instrumental-342891.mp3',
        displayName: 'Fun & Happy (instrumental) | O. Savochka | 2:09',
        genre: 'Uplifting',
        duration: '2:09',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/fun-happy-instrumental-342891.mp3'
      },
      {
        id: 'golden-dayz-upbeat-ukulele-456123',
        name: 'golden-dayz-upbeat-ukulele-456123.mp3',
        displayName: 'Golden Dayz (upbeat ukulele) | P. Winter | 3:00',
        genre: 'Uplifting',
        duration: '3:00',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/golden-dayz-upbeat-ukulele-456123.mp3'
      },
      {
        id: 'happy-background-music-567234',
        name: 'happy-background-music-567234.mp3',
        displayName: 'Happy Background Music | A. Poradovskyi | 2:12',
        genre: 'Uplifting',
        duration: '2:12',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/happy-background-music-567234.mp3'
      },
      {
        id: 'happy-flute-678345',
        name: 'happy-flute-678345.mp3',
        displayName: 'Happy Flute | M. Mosca | 2:04',
        genre: 'Uplifting',
        duration: '2:04',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/happy-flute-678345.mp3'
      },
      {
        id: 'happy-jazz-789456',
        name: 'happy-jazz-789456.mp3',
        displayName: 'Happy Jazz | John Schofield | 2:08',
        genre: 'Uplifting',
        duration: '2:08',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/happy-jazz-789456.mp3'
      },
      {
        id: 'inspirational-uplifting-music-891567',
        name: 'inspirational-uplifting-music-891567.mp3',
        displayName: 'Inspirational Uplifting Music | TataMusic | 2:00',
        genre: 'Uplifting',
        duration: '2:00',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/inspirational-uplifting-music-891567.mp3'
      },
      {
        id: 'jazz-background-instrumental-912678',
        name: 'jazz-background-instrumental-912678.mp3',
        displayName: 'Jazz Background (Instr.) | A. Poradovskyi | 5:55',
        genre: 'Uplifting',
        duration: '5:55',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/jazz-background-instrumental-912678.mp3'
      },
      {
        id: 'petites-funerailles-organ-123789',
        name: 'petites-funerailles-organ-123789.mp3',
        displayName: 'Petites funérailles (organ) | J.P. Verpeaux | 4:00',
        genre: 'Uplifting',
        duration: '4:00',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/petites-funerailles-organ-123789.mp3'
      },
      {
        id: 'piano-background-234891',
        name: 'piano-background-234891.mp3',
        displayName: 'Piano Background | D. Kolesnikov | 2:40',
        genre: 'Uplifting',
        duration: '2:40',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/piano-background-234891.mp3'
      },
      {
        id: 'under-a-starry-sky-orchestra-345912',
        name: 'under-a-starry-sky-orchestra-345912.mp3',
        displayName: 'Under A Starry Sky (Orchestra) | P. Winter | 3:02',
        genre: 'Uplifting',
        duration: '3:02',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/under-a-starry-sky-orchestra-345912.mp3'
      },
      {
        id: 'uplifting-inspirational-music-456123',
        name: 'uplifting-inspirational-music-456123.mp3',
        displayName: 'Uplifting Inspirational Music | M. Malko | 4:07',
        genre: 'Uplifting',
        duration: '4:07',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/uplifting-inspirational-music-456123.mp3'
      },
      {
        id: 'uplifting-piano-is-567234',
        name: 'uplifting-piano-is-567234.mp3',
        displayName: 'Uplifting Piano Is | Music Unlimited | 1:10',
        genre: 'Uplifting',
        duration: '1:10',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/uplifting-piano-is-567234.mp3'
      },
      {
        id: 'uplifting-ukulele-678345',
        name: 'uplifting-ukulele-678345.mp3',
        displayName: 'Uplifting Ukulele | D. Silverstone | 2:04',
        genre: 'Uplifting',
        duration: '2:04',
        url: 'https://order-by-age-uploads.s3.us-east-2.amazonaws.com/library-songs/uplifting-ukulele-678345.mp3'
      }
    ];
    
    // Parse job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('job');
    const isFinalized = urlParams.get('finalized') === 'true';
    const isSharedView = urlParams.get('share') === 'true';
    
    // Track changes made by user
    let pendingChanges = {};
    let currentSettings = {};
    let currentSongs = [];
    let currentlyPlayingAudio = null;
    let newPptxFile = null;
    
    // Prevent going back if finalized
    if (isFinalized) {
      history.pushState(null, null, location.href);
      history.pushState(null, null, location.href);
      
      window.addEventListener('popstate', function(event) {
        history.pushState(null, null, location.href);
      });
    }
    
    if (!jobId) {
      showError('No job ID provided in URL. Please check your link.');
    } else {
      loadJobData(jobId);
    }
    
    // Render song library
    function renderLibrary() {
      const container = document.getElementById('libraryGrid');
      const selectedGenre = document.getElementById('genreSelect').value;
  
      // Filter songs by selected genre
      const filteredSongs = SONG_LIBRARY.filter(song => song.genre === selectedGenre);
  
      let html = '';
      filteredSongs.forEach(song => {
        const isAdded = currentSongs.some(s => s.id === song.id);
        const cardClass = isAdded ? 'library-song-card added' : 'library-song-card';
        const btnClass = isAdded ? 'btn-add-library added' : 'btn-add-library';
        const btnText = isAdded ? '✓ Added' : '+ Add';
        const audioId = `audio-lib-${song.id}`;
    
        html += `
          <div class="${cardClass}" data-song-id="${song.id}">
            <div class="library-song-name">${song.displayName}</div>
            <div class="library-song-controls">
              <button class="btn-small btn-play" onclick="togglePlay('${audioId}', this)">▶️ Play Song</button>
              <button class="${btnClass}" onclick="addLibrarySong('${song.id}')" ${isAdded || currentSongs.length >= MAX_SONGS ? 'disabled' : ''}>
                ${btnText}
              </button>
            </div>
            <audio id="${audioId}" src="${song.url}" preload="none"></audio>
          </div>
        `;
      });
  
      container.innerHTML = html;
    }
    
    // Add library song to current songs
    function addLibrarySong(songId) {
      if (currentSongs.length >= MAX_SONGS) {
        showToast(`Maximum ${MAX_SONGS} songs reached`, 'error');
        return;
      }
      
      const libSong = SONG_LIBRARY.find(s => s.id === songId);
      if (!libSong) return;
      
      // Check if already added
      if (currentSongs.some(s => s.id === songId)) {
        showToast('Song already added', 'error');
        return;
      }
      
      currentSongs.push({
        id: libSong.id,
        name: libSong.name,
        displayName: libSong.displayName,
        url: libSong.url,
        isNew: false,
        isLibrary: true,
        file: null,
        duration: libSong.duration
      });
      
      renderLibrary();
      renderSongList();
      updateSongCount();
      updateSongRangeSliders();
      calculateVideoDuration();
      showToast(`Added "${libSong.displayName}"`, 'success');
    }
    
    // Load job data from API
    async function loadJobData(jobId) {
      try {
        console.log('[API] Calling:', `${API_BASE}/jobs/${jobId}`);
        const response = await fetch(`${API_BASE}/jobs/${jobId}`);
    
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log('[API] Response:', data);

        // Load version history
        await loadVersionHistory(jobId);
    
        // Store current settings
        if (data.settings) {
          currentSettings = data.settings;
          
          const deceasedName = data.settings.fullName;
          if (deceasedName && deceasedName !== 'your loved one' && deceasedName !== '') {
            document.getElementById('headerTitle').textContent = `✨ ${deceasedName}'s Memorial Video`;
            document.title = `${deceasedName}'s Memorial Video`;
          }

          displaySummary(data.settings);
        }
    
        // Initialize songs from API response
        if (data.songs && data.songs.length > 0) {
          currentSongs = data.songs.map(song => {
            // Check if this is a library song
            const libSong = SONG_LIBRARY.find(lib => lib.name === song.name);

            // ✅ GET ORIGINAL FILENAME FROM SETTINGS
            const originalName = data.settings?.originalFilenames?.[song.name] || song.name;
            console.log(`[SONG MAP] ${song.name} -> originalName: ${originalName}`);
        
            return {
              id: libSong ? libSong.id : song.name,
              name: song.name,
              displayName: libSong ? libSong.displayName : originalName,
              url: song.url,
              isNew: false,
              isLibrary: !!libSong,
              file: null,
              duration: libSong ? libSong.duration : (song.duration || null)  // ✅ ADD THIS LINE
            };
          });

          currentSongs.forEach(song => {
            if (!song.isLibrary && song.url) {
              const audio = new Audio(song.url);
              audio.addEventListener('loadedmetadata', () => {
                const duration = Math.round(audio.duration);
                song.duration = duration;
                console.log(`[DURATION LOADED] ${song.name}: ${duration}s`);
                calculateVideoDuration(); // Recalculate when duration loads
              });
              audio.addEventListener('error', (e) => {
                console.error(`[DURATION ERROR] Failed to load ${song.name}:`, e);
              });
            }
          });
        } else if (data.settings && data.settings.audioCount > 0) {
          const audioCount = data.settings.audioCount;
          for (let i = 1; i <= audioCount; i++) {
            currentSongs.push({
              id: `song${i}.mp3`,
              name: `song${i}.mp3`,
              displayName: `song${i}.mp3`,
              url: null,
              isNew: false,
              isLibrary: false,
              file: null
            });
          }
        }
    
        // ✅ MOVED HERE: populate form defaults AFTER songs are loaded
        if (data.settings) {
          populateFormDefaults(data.settings);
        }
    
        // Auto-redirect to finalized page if job is already finalized
        if (data.isFinalized && !isFinalized) {
          console.log('[REDIRECT] Job is finalized, redirecting...');
          window.location.replace(`${window.location.origin}${window.location.pathname}?job=${jobId}&finalized=true`);
          return;
        }
    
        displayVideo(data);
        setupManualEditButtons(data);
        renderLibrary();
        renderSongList();
        updateSongCount();
      } catch (error) {
        console.error('[API ERROR]', error);
        showError('Failed to load video data: ' + error.message);
      }
    }

    // Load version history for this job
    async function loadVersionHistory(baseJobId) {
      try {
        console.log('[VERSIONS] Loading version history for:', baseJobId);
        const response = await fetch(`${API_BASE}/jobs/${baseJobId}/versions`);
    
        if (!response.ok) {
          console.warn('[VERSIONS] No version history available');
          return;
        }
    
        const versions = await response.json();
        console.log('[VERSIONS] Loaded:', versions);
    
        allVersions = versions;
        currentVersionIndex = versions.findIndex(v => v.jobId === baseJobId);
    
        if (versions.length > 1) {
          populateVersionDropdown();
        }
      } catch (error) {
        console.error('[VERSIONS ERROR]', error);
      }
    }

    // Populate version dropdown
    function populateVersionDropdown() {
      const selector = document.getElementById('versionSelector');
      const dropdown = document.getElementById('versionDropdown');
  
      if (allVersions.length <= 1) {
        selector.style.display = 'none';
        return;
      }
  
      let html = '';
      allVersions.forEach((version, index) => {
        const versionNum = version.version;
        const createdBy = version.createdBy || 'Unknown';
        const isCurrent = version.jobId === jobId;
        html += `<option value="${index}" ${isCurrent ? 'selected' : ''}>
          v${versionNum} - Made by ${createdBy}${isCurrent ? ' (Current)' : ''}
        </option>`;
      });
  
      dropdown.innerHTML = html;
      selector.style.display = 'block';
  
      updateRevertButton();
    }

    // Update revert button visibility
    function updateRevertButton() {
      const revertBtn = document.getElementById('revertBtn');
      const dropdown = document.getElementById('versionDropdown');
      const selectedIndex = parseInt(dropdown.value);
  
      // Show revert button if viewing an older version
      if (selectedIndex !== currentVersionIndex) {
        revertBtn.style.display = 'inline-block';
      } else {
        revertBtn.style.display = 'none';
      }
    }
    
    function displaySummary(settings) {
      const summaryBox = document.getElementById('summaryBox');
  
      if (!summaryBox) {
        console.warn('[DISPLAY SUMMARY] summaryBox element not found');
        return;
      }
      
      // Format duration
      let durationText = '';
      if (settings.timingMode === 'fixedRuntime' && settings.fixedRuntimeSec) {
        const minutes = Math.floor(settings.fixedRuntimeSec / 60);
        const seconds = settings.fixedRuntimeSec % 60;
        durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      } else if (settings.timingMode === 'perSlide' && settings.perSlideSec) {
        durationText = `${settings.perSlideSec}s per slide`;
      } else if (settings.timingMode === 'fitToSongs') {
        durationText = 'matched to music length';
      } else {
        durationText = 'custom timing';
      }
      
      // Timing mode display name
      const timingModeNames = {
        'fixedRuntime': 'Fixed Runtime',
        'perSlide': 'Per Slide Duration',
        'fitToSongs': 'Fit to Music'
      };
      const timingModeName = timingModeNames[settings.timingMode] || settings.timingMode;
      
      // Visual package display name
      const visualPackageNames = {
        'simple-fade-wipe': 'Simple Fade & Wipe',
        'pages-of-life': 'Pages of Life',
        'floating-frames': 'Floating Frames',
        'zoom-through': 'Zoom Through',
        'blinds-combs-bars': 'Blinds, Combs & Bars'
      };
      const visualPackageName = visualPackageNames[settings.visualPackage] || settings.visualPackage;
      
      // Music distribution display name
      const musicDistNames = {
        'evenlyDistributed': 'Evenly Distributed',
        'specifyPlacement': 'Specify Placement'
      };
      const musicDistName = musicDistNames[settings.musicDistribution] || settings.musicDistribution;
      
      // Build summary
      const audioCount = settings.audioCount || 3;
      summaryBox.innerHTML = `
        Your <strong>${durationText}</strong> video uses <strong>${timingModeName}</strong> mode with <strong>${visualPackageName}</strong> transitions and <strong>${audioCount} song${audioCount !== 1 ? 's' : ''}</strong> (${musicDistName}).
      `;
      
      summaryBox.style.display = 'block';
    }

        // Update summary box with actual video duration from loaded video
    function updateSummaryWithActualDuration(actualSeconds, settings) {
      const summaryBox = document.getElementById('summaryBox');
      
      if (!summaryBox) {
        console.warn('[UPDATE SUMMARY] summaryBox element not found');
        return;
      }
      
      console.log('[UPDATE SUMMARY] Updating with actual duration:', actualSeconds, 'seconds');
      
      // Format actual duration based on timing mode
      let durationText = '';
      if (settings.timingMode === 'fixedRuntime') {
        // Convert seconds to MM:SS format
        const minutes = Math.floor(actualSeconds / 60);
        const seconds = actualSeconds % 60;
        durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        console.log('[UPDATE SUMMARY] Formatted duration:', durationText);
      } else if (settings.timingMode === 'perSlide' && settings.perSlideSec) {
        // Keep per-slide format (doesn't change)
        durationText = `${settings.perSlideSec}s per slide`;
      } else if (settings.timingMode === 'fitToSongs') {
        // Keep fit-to-music format (doesn't change)
        durationText = 'matched to music length';
      } else {
        durationText = 'custom timing';
      }
      
      // Timing mode display name
      const timingModeNames = {
        'fixedRuntime': 'Fixed Runtime',
        'perSlide': 'Per Slide Duration',
        'fitToSongs': 'Fit to Music'
      };
      const timingModeName = timingModeNames[settings.timingMode] || settings.timingMode;
      
      // Visual package display name
      const visualPackageNames = {
        'simple-fade-wipe': 'Simple Fade & Wipe',
        'pages-of-life': 'Pages of Life',
        'floating-frames': 'Floating Frames',
        'zoom-through': 'Zoom Through',
        'blinds-combs-bars': 'Blinds, Combs & Bars'
      };
      const visualPackageName = visualPackageNames[settings.visualPackage] || settings.visualPackage;
      
      // Music distribution display name
      const musicDistNames = {
        'evenlyDistributed': 'Evenly Distributed',
        'specifyPlacement': 'Specify Placement'
      };
      const musicDistName = musicDistNames[settings.musicDistribution] || settings.musicDistribution;
      
      // Build updated summary
      const audioCount = settings.audioCount || 3;
      summaryBox.innerHTML = `
        Your <strong>${durationText}</strong> video uses <strong>${timingModeName}</strong> mode with <strong>${visualPackageName}</strong> transitions and <strong>${audioCount} song${audioCount !== 1 ? 's' : ''}</strong> (${musicDistName}).
      `;
      
      console.log('[UPDATE SUMMARY] ✅ Summary updated successfully');
    }
    
    // Populate form defaults from settings
    function populateFormDefaults(settings) {
      // Transitions
      if (settings.visualPackage) {
        document.getElementById('visualPackage').value = settings.visualPackage;
      }
      
      // Timing
      if (settings.timingMode) {
        const radio = document.querySelector(`input[name="timingMode"][value="${settings.timingMode}"]`);
        if (radio) {
          radio.checked = true;
          handleTimingModeChange(settings.timingMode);
        }
      }
      if (settings.perSlideSec) {
        document.getElementById('perSlideSec').value = settings.perSlideSec;
      }
      if (settings.fixedRuntimeSec) {
        document.getElementById('fixedRuntimeSec').value = settings.fixedRuntimeSec;
      }
      
      // Song Logic - only set if NOT using fitToSongs
      if (settings.timingMode !== 'fitToSongs' && settings.musicDistribution) {
        document.getElementById('musicDistribution').value = settings.musicDistribution;
        handleMusicDistributionChange(settings.musicDistribution);
      }
    }
    // Render song list
    function renderSongList() {
      const container = document.getElementById('songList');
      
      if (currentSongs.length === 0) {
        container.innerHTML = '<div style="color: #999; font-style: italic;">No songs selected. Choose from the library above or upload your own!</div>';
        return;
      }
      
      let html = '';
      currentSongs.forEach((song, index) => {
        const audioId = `audio-${song.id}`;
        const newBadge = song.isNew ? '<span class="song-badge">NEW</span>' : '';
        const libraryBadge = song.isLibrary ? '<span class="song-badge library">LIBRARY</span>' : '';
        
        let itemClass = 'song-item';
        if (song.isNew) itemClass += ' new-upload';
        if (song.isLibrary) itemClass += ' library-song';
        
        const position = index + 1;
        
        html += `
          <div class="${itemClass}">
            <div class="song-info">
              <div class="song-position">${position}</div>
              <span class="song-name">${song.displayName}</span>
              ${newBadge}
              ${libraryBadge}
            </div>
            <div class="song-controls">
              ${song.url ? `<button class="btn-small btn-play" onclick="togglePlay('${audioId}', this)">▶️ Play Song</button>` : ''}
              <button class="btn-small btn-move" onclick="moveSongUp(${index})" ${index === 0 ? 'disabled' : ''}>⬆️ Move Up</button>
              <button class="btn-small btn-move" onclick="moveSongDown(${index})" ${index === currentSongs.length - 1 ? 'disabled' : ''}>⬇️ Move Down</button>
              <button class="btn-small btn-danger" onclick="removeSong(${index})">🗑️</button>
            </div>
            ${song.url ? `<audio id="${audioId}" src="${song.url}" preload="none"></audio>` : ''}
          </div>
        `;
      });
      
      container.innerHTML = html;
      updateSongTracking();
    }
    
    // Toggle audio play/pause
    function togglePlay(audioId, button) {
      const audio = document.getElementById(audioId);
  
      if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
        currentlyPlayingAudio.pause();
        currentlyPlayingAudio.currentTime = 0;
        document.querySelectorAll('.btn-play').forEach(btn => {
          btn.textContent = '▶️ Play Song';
          btn.classList.remove('playing');
        });
      }
  
      if (audio.paused) {
        audio.play().catch(err => {
          console.error('Play error:', err);
          button.textContent = '▶️ Play Song';
          button.classList.remove('playing');
        });
        button.textContent = '⏸️ Pause Song';
        button.classList.add('playing');
        currentlyPlayingAudio = audio;
    
        audio.onended = () => {
          button.textContent = '▶️ Play Song';
          button.classList.remove('playing');
          currentlyPlayingAudio = null;
        };
      } else {
        audio.pause();
        audio.currentTime = 0;
        button.textContent = '▶️ Play Song';
        button.classList.remove('playing');
        currentlyPlayingAudio = null;
      }
    }
    
    // Move song up
    function moveSongUp(index) {
      if (index === 0) return;
      const temp = currentSongs[index];
      currentSongs[index] = currentSongs[index - 1];
      currentSongs[index - 1] = temp;
      renderSongList();
      updateSongRangeSliders();
    }
    
    // Move song down
    function moveSongDown(index) {
      if (index === currentSongs.length - 1) return;
      const temp = currentSongs[index];
      currentSongs[index] = currentSongs[index + 1];
      currentSongs[index + 1] = temp;
      renderSongList();
      updateSongRangeSliders();
    }
    
    // Remove song
    function removeSong(index) {
      if (!confirm(`Remove "${currentSongs[index].displayName}"?`)) return;
      currentSongs.splice(index, 1);
      renderLibrary();
      renderSongList();
      updateSongCount();
      updateSongRangeSliders();
      calculateVideoDuration();
    }
      
    // Update song count display
    function updateSongCount() {
      const display = document.getElementById('songCountDisplay');
      const uploadSection = document.getElementById('uploadSection');
      const uploadLabel = document.getElementById('uploadLabel');
      
      const songWord = currentSongs.length === 1 ? 'song' : 'songs';
      display.textContent = `${currentSongs.length} ${songWord} selected`;
      
      if (currentSongs.length >= MAX_SONGS) {
        uploadSection.classList.add('max-reached');
        uploadLabel.classList.add('disabled');
      } else {
        uploadSection.classList.remove('max-reached');
        uploadLabel.classList.remove('disabled');
      }
      
      // Update library add buttons
      renderLibrary();
    }

    // ✅ ADD THIS ENTIRE FUNCTION HERE
    // Calculate and display video duration
    function calculateVideoDuration() {
      const slideCount = null; // Removed manual input - slideCount comes from API
      const timingMode = document.querySelector('input[name="timingMode"]:checked')?.value;

      const displayDiv = document.getElementById('durationDisplay');
      const valueDiv = document.getElementById('durationValue');
      const detailsDiv = document.getElementById('durationDetails');

      console.log('[DURATION CALC] Slide count:', slideCount);
      console.log('[DURATION CALC] Timing mode:', timingMode);
      console.log('[DURATION CALC] Current songs:', currentSongs);
      
      // Hide if no slide count
      if (!slideCount) {
        displayDiv.style.display = 'none';
        return;
      }

      let totalSeconds = 0;
      let detailsText = '';

      if (timingMode === 'perSlide') {
        const perSlideSec = parseInt(document.getElementById('perSlideSec').value) || 5;
        totalSeconds = (slideCount - 2) * perSlideSec + (2 * perSlideSec * 2);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        detailsText = `Video will be ${timeDisplay} long with ${slideCount} slides at ${perSlideSec} seconds per slide (beginning and end slide at ${perSlideSec * 2}s)`;

      } else if (timingMode === 'fixedRuntime') {
        totalSeconds = parseInt(document.getElementById('fixedRuntimeSec').value) || 320;
        const avgPerSlide = Math.round(totalSeconds / slideCount);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        detailsText = `Video will be ${timeDisplay} long across ${slideCount} slides at approximately ${avgPerSlide} seconds per slide`;

      } else if (timingMode === 'fitToSongs') {
        console.log('[FIT TO SONGS] Calculating total duration...'); // ✅ ADD THIS LINE
  
        totalSeconds = currentSongs.reduce((sum, song) => {
          console.log(`[FIT TO SONGS] Song: ${song.displayName}, Duration: ${song.duration}`); // ✅ ADD THIS LINE TOO
          return sum + (song.duration || 0);
        }, 0);
  
        console.log('[FIT TO SONGS] Total seconds:', totalSeconds); // ✅ AND THIS LINE

        if (totalSeconds === 0) {
          detailsText = 'Add songs to calculate duration';
          displayDiv.style.display = 'none';
          return;
        }

        const avgPerSlide = Math.round(totalSeconds / slideCount);
        const songWord = currentSongs.length === 1 ? 'song' : 'songs';
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        detailsText = `Video will be ${timeDisplay} long based on ${currentSongs.length} selected ${songWord} at ${avgPerSlide} seconds per slide (beginning and end slide at ${avgPerSlide * 2}s)`;
      }

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      valueDiv.textContent = formattedTime;
      detailsDiv.textContent = detailsText;
      displayDiv.style.display = 'block';
    }
    
    // Handle new song uploads
    document.getElementById('uploadLabel').addEventListener('click', showMusicTermsModal);
    document.getElementById('newSongUpload').addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
  
      files.forEach(file => {
        if (currentSongs.length >= MAX_SONGS) {
          showToast(`Maximum ${MAX_SONGS} songs reached`, 'error');
          return;
        }
    
        if (!file.type.includes('audio/mpeg') && !file.name.endsWith('.mp3')) {
          showToast(`${file.name} is not an MP3 file`, 'error');
          return;
        }
    
        const localUrl = URL.createObjectURL(file);
    
        // ✅ CREATE AUDIO ELEMENT TO DETECT DURATION
        const audio = new Audio(localUrl);
        audio.addEventListener('loadedmetadata', () => {
          const duration = Math.round(audio.duration);
      
        // Find the song and update its duration
        const song = currentSongs.find(s => s.url === localUrl);
        if (song) {
          song.duration = duration;
          console.log(`[DURATION] ${file.name}: ${duration}s`);
          calculateVideoDuration(); // Recalculate after getting duration
        }
      });
    
      currentSongs.push({
        id: `new-${Date.now()}-${Math.random()}`,
        name: file.name,
        displayName: file.name,
        url: localUrl,
        isNew: true,
        isLibrary: false,
        file: file,
        duration: null  // ✅ ADD THIS - Will be set when metadata loads
      });
    });
  
    renderSongList();
    updateSongCount();
    updateSongRangeSliders();
    calculateVideoDuration();  // ✅ ADD THIS
  
    e.target.value = '';
  });
    document.getElementById('genreSelect').addEventListener('change', () => {
      renderLibrary();
    });

    // Version dropdown change handler
    document.getElementById('versionDropdown').addEventListener('change', async (e) => {
      updateRevertButton();
  
      const selectedIndex = parseInt(e.target.value);
      const selectedVersion = allVersions[selectedIndex];
  
      if (!selectedVersion) return;
  
      console.log('[VERSIONS] Switching to version:', selectedVersion.jobId);
  
      // Reload page with selected version's jobId
      const newUrl = `${window.location.origin}${window.location.pathname}?job=${selectedVersion.jobId}`;
      window.location.href = newUrl;
    });

    // Revert button handler
    document.getElementById('revertBtn').addEventListener('click', async () => {
      const dropdown = document.getElementById('versionDropdown');
      const selectedIndex = parseInt(dropdown.value);
      const selectedVersion = allVersions[selectedIndex];
  
      if (!selectedVersion) return;
  
      const versionNum = selectedVersion.version;
      const confirmed = confirm(
        `Revert to version ${versionNum}?\n\n` +
        'This will create a new version based on the settings from this previous version. ' +
        'You can always switch back to any version later.'
      );
  
      if (!confirmed) return;
  
      try {
        showToast('Creating new version from v' + versionNum + '...', 'success');
    
        // Submit as a resubmission using the old version's settings
        const response = await fetch(`${API_BASE}/jobs/${jobId}/resubmit`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            originalJobId: jobId,
            revertToJobId: selectedVersion.jobId,
            changes: selectedVersion.settings
          })
        });
    
        if (!response.ok) {
          throw new Error('Failed to revert version');
        }
    
        const result = await response.json();
        console.log('[REVERT] Success:', result);
    
        showToast(
          `✅ Successfully created new version from v${versionNum}! ` +
          'You\'ll receive an email in 5-15 minutes.',
          'success'
        );
    
        // Reload after 2 seconds
        setTimeout(() => {
          location.reload();
        }, 2000);
    
      } catch (error) {
        console.error('[REVERT ERROR]', error);
        showToast('Failed to revert: ' + error.message, 'error');
      }
    });
    
    // Handle PowerPoint file upload
    document.getElementById('newPptxUpload').addEventListener('change', (e) => {
      const file = e.target.files[0];
      
      if (!file) return;
      
      if (!file.name.endsWith('.pptx') && !file.type.includes('presentationml')) {
        showToast('Please select a valid PowerPoint (.pptx) file', 'error');
        e.target.value = '';
        return;
      }
      
      newPptxFile = file;
      
      const previewDiv = document.getElementById('pptxFilePreview');
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      previewDiv.innerHTML = `
        <div class="pptx-file-preview">
          <div class="pptx-file-info">
            <span class="pptx-file-icon">📄</span>
            <div class="pptx-file-details">
              <span class="pptx-file-name">${file.name}</span>
              <span class="pptx-file-size">${fileSizeMB} MB</span>
            </div>
          </div>
          <button class="btn-small btn-danger" onclick="clearPptxUpload()">🗑️ Remove</button>
        </div>
      `;
      previewDiv.style.display = 'block';
      
      trackChange('newPresentationFile', true);
      showToast('PowerPoint file ready to upload!', 'success');
    });
    
    // Clear PowerPoint upload
    function clearPptxUpload() {
      newPptxFile = null;
      document.getElementById('newPptxUpload').value = '';
      document.getElementById('pptxFilePreview').style.display = 'none';
      delete pendingChanges.newPresentationFile;
      updateResubmitButton();
      showToast('PowerPoint file removed', 'success');
    }
    
    // Track song changes for resubmit
    function updateSongTracking() {
      // ✅ USE DISPLAYNAME WHICH HAS THE ORIGINAL FILENAME
      const songOrder = currentSongs.map(song => {
        // For existing songs from previous submission, use the displayName (which is the original filename)
        // For new songs, use the actual filename
        if (song.isNew && song.file) {
          return song.file.name;
        } else if (song.isLibrary) {
          return song.name; // Library songs use their actual filename
        } else {
          // Existing custom song - use displayName which has the original filename
          return song.displayName;
        }
      });
  
      const newSongs = currentSongs.filter(s => s.isNew).map(s => ({
        originalName: s.file ? s.file.name : s.name,
        file: s.file
      }));
  
      const hasChanges = currentSongs.some(s => s.isNew) || 
                        JSON.stringify(songOrder) !== JSON.stringify(currentSongs.map(s => s.name));
  
      if (hasChanges || newSongs.length > 0) {
        trackChange('songOrder', songOrder);
        if (newSongs.length > 0) {
          trackChange('newSongs', newSongs);
        }
     }
  }
    
    // Setup song range sliders
    function setupSongRangeSliders() {
      const container = document.getElementById('songRangesList');
  
      if (currentSongs.length === 0) {
        container.innerHTML = '<div style="color: #999; font-style: italic;">No songs available. Add songs first.</div>';
        return;
      }
  
      let html = '';
      let exampleStart = 1;
      let exampleEnd = 19;
  
      currentSongs.forEach((song, index) => {
        const audioId = `audio-range-${song.id}`;
        const playButton = song.url ? `<button class="btn-small btn-play" onclick="togglePlay('${audioId}', this)" style="margin-left: 8px;">▶️ Play Song</button>` : '';
    
        // Auto-populate start value: first song starts at 1, others start at previous end + 1
        const startValue = index === 0 ? '1' : '';
        
        // Calculate example placeholders
        const startPlaceholder = `Example: ${exampleStart}`;
        const endPlaceholder = `Example: ${exampleEnd}`;
    
        html += `
          <div class="song-range-item">
            <div class="song-range-header">
              🎵 ${song.displayName}
              ${playButton}
              ${song.url ? `<audio id="${audioId}" src="${song.url}" preload="none"></audio>` : ''}
            </div>
            <div class="slide-inputs">
              <div class="slide-input-group">
                <label>Start Slide</label>
                <input type="number" 
                       id="songRange${index}Start" 
                       class="song-range-input"
                       data-song-index="${index}"
                       data-type="start"
                       min="1" 
                       max="250"
                       value="${startValue}"
                       placeholder="${startPlaceholder}">
              </div>
              <div class="slide-input-group">
                <label>End Slide</label>
                <input type="number" 
                       id="songRange${index}End" 
                       class="song-range-input"
                       data-song-index="${index}"
                       data-type="end"
                       min="1" 
                       max="250" 
                       placeholder="${endPlaceholder}">
              </div>
           </div>
        </div>
      `;
        
       // Update examples for next song
        exampleStart = exampleEnd + 1;
        exampleEnd = exampleStart + 17; // Each song spans about 18 slides in examples
    });
  
    container.innerHTML = html;
  
    document.querySelectorAll('.song-range-input').forEach(input => {
      input.addEventListener('input', handleSongRangeChange);
    });
  }
    
    // Update song range sliders (wrapper for setup)
    function updateSongRangeSliders() {
      const musicDist = document.getElementById('musicDistribution').value;
      
      if (musicDist === 'specifyPlacement') {
        setupSongRangeSliders();
      }
    }
    
    // Handle song range input changes
    function handleSongRangeChange(e) {
      const changedIndex = parseInt(e.target.dataset.songIndex);
      const changedType = e.target.dataset.type;
  
      // If an "End Slide" changed, update the next song's start slide
      if (changedType === 'end' && changedIndex < currentSongs.length - 1) {
        const endValue = parseInt(e.target.value);
        if (!isNaN(endValue)) {
          const nextStartInput = document.getElementById(`songRange${changedIndex + 1}Start`);
          if (nextStartInput) {
            nextStartInput.value = endValue + 1;
          }
        }
     }
  
     // Rebuild songRanges array
     const songRanges = [];

     currentSongs.forEach((song, index) => {
       const startInput = document.getElementById(`songRange${index}Start`);
       const endInput = document.getElementById(`songRange${index}End`);

       if (startInput && endInput) {
         const startVal = parseInt(startInput.value);
         const endVal = parseInt(endInput.value);
  
         if (!isNaN(startVal) && !isNaN(endVal)) {
           // FIX: For uploaded songs, extract filename from S3 URL
           // For library songs, use the original name
           let songIdentifier = song.name;
        
           if (!song.isLibrary && song.url && song.url.startsWith('blob:')) {
             // New upload with blob URL - use the original filename
             songIdentifier = song.name;
           } else if (!song.isLibrary && song.url && song.url.includes('/temp-uploads/')) {
             // Previously uploaded song - extract filename from S3 URL
             songIdentifier = song.url.split('/').pop();
             console.log(`[SONG RANGE] Mapped uploaded song: ${song.name} -> ${songIdentifier}`);
           }
        
           songRanges.push({
             song: songIdentifier,
             startSlide: startVal,
             endSlide: endVal
           });
         }
       }
     });

     if (songRanges.length > 0) {
       trackChange('songRanges', songRanges);
     } else {
       delete pendingChanges.songRanges;
       updateResubmitButton();
     }

     console.log('[SONG RANGES]', songRanges);
   }
    
    // Handle music distribution change
    function handleMusicDistributionChange(value) {
      const container = document.getElementById('songRangesContainer');
      
      if (value === 'specifyPlacement') {
        container.style.display = 'block';
        setupSongRangeSliders();
      } else {
        container.style.display = 'none';
        delete pendingChanges.songRanges;
        updateResubmitButton();
      }
    }
    
    // Setup manual edit buttons based on presentation type
    function setupManualEditButtons(data) {
      const container = document.getElementById('manualEditButtons');
      const infoBox = document.getElementById('manualEditInfoBox');
      const pptxUploadSection = document.getElementById('pptxUploadSection');
      
      if (data.provider === 'google_slides') {
        infoBox.innerHTML = 'Select to edit your <strong>Google Slides</strong> to make manual changes, and once you are done you may select "Resubmit Changes" at the bottom along with any other changes you made. This version will be published in the next Video.';
        pptxUploadSection.style.display = 'none';
      } else if (data.provider === 'powerpoint') {
        infoBox.innerHTML = 'Select to edit your <strong>PowerPoint</strong> to make manual changes, or upload a new PowerPoint file below. Once you are done, select "Resubmit Changes" at the bottom along with any other changes you made. This version will be published in the next Video.';
        pptxUploadSection.style.display = 'block';
      }
      
      if (data.provider === 'google_slides' && data.original_url) {
        container.innerHTML = `
          <button class="btn btn-primary" onclick="handleManualEditClick('${data.original_url}')" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); border: none;">
            📊 Edit Google Slides
          </button>
        `;
      } else if (data.provider === 'powerpoint' && data.original_url) {
        container.innerHTML = `
          <button class="btn btn-primary" onclick="handleManualEditClick('${data.original_url}')" style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); border: none;">
            📄 Edit PowerPoint
          </button>
        `;
      } else {
        container.innerHTML = `
          <div style="color: #999; font-style: italic;">
            Presentation link not available for this job.
          </div>
        `;
      }
    }
    
    // Handle manual edit button click
    function handleManualEditClick(url) {
      window.open(url, '_blank');
      trackChange('manualEditsRequested', true);
      showToast('Presentation opened! Make your changes, then click "Resubmit Changes" when done.', 'success');
    }
    
    // Display video and controls
    function displayVideo(data) {
      const container = document.getElementById('videoContainer');
      const jobInfo = document.getElementById('jobInfo');
      
      jobInfo.textContent = `Order #${data.jobId}`;
      
      if (isFinalized) {
        container.innerHTML = `
          <div class="video-wrapper">
            <video controls preload="auto">
              <source src="${data.videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
        `;
        
        document.getElementById('actionButtons').style.display = 'none';
        document.getElementById('finalizedMessage').style.display = 'block';
        document.getElementById('finalDownloadBtn').href = '#';
        document.getElementById('finalDownloadBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            await downloadVideo(jobId);
        });
        return;
      }
      
      container.innerHTML = `
        <div class="video-wrapper">
          <video controls preload="auto" crossorigin="anonymous">
            <source src="${data.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
      
      const video = container.querySelector('video');
      video.addEventListener('loadstart', () => console.log('[VIDEO] Loading started'));
      
      // 👇 THIS IS THE CHANGED PART 👇
      video.addEventListener('loadedmetadata', () => {
        console.log('[VIDEO] Metadata loaded');
        console.log('[VIDEO] Actual duration:', video.duration, 'seconds');
        
        // Update summary with actual video duration
        if (video.duration && data.settings) {
          const actualDurationSeconds = Math.round(video.duration);
          console.log('[VIDEO] Updating summary with actual duration:', actualDurationSeconds);
          updateSummaryWithActualDuration(actualDurationSeconds, data.settings);
        }
      });
      // 👆 END OF CHANGED PART 👆
      
      video.addEventListener('canplay', () => console.log('[VIDEO] Can play'));
      video.addEventListener('error', (e) => {
        console.error('[VIDEO ERROR]', e);
        console.error('[VIDEO ERROR] Details:', video.error);
        showError('Video failed to load. The file may be corrupted or the URL expired.');
      });
      
      document.getElementById('editBtn').style.display = 'inline-flex';
      document.getElementById('shareBtn').style.display = 'inline-flex';
      document.getElementById('deliverBtn').style.display = 'inline-flex';
      document.getElementById('helpBtn').style.display = 'inline-flex';
      document.getElementById('finalizeBtn').style.display = 'inline-flex';
      
      window.videoData = data;
      
      setupFinalizeButton();
      setupEditButton();
    }
    
    // Show error message
    function showError(message) {
      const container = document.getElementById('videoContainer');
      container.innerHTML = `<div class="error">${message}</div>`;
    }
    
    // Toast notification
    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.className = `toast ${type} show`;
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
    
    // Edit button handler
    function setupEditButton() {
      document.getElementById('editBtn').addEventListener('click', () => {
        const editSections = document.getElementById('editSections');
        const isVisible = editSections.style.display !== 'none';
        
        if (isVisible) {
          editSections.style.display = 'none';
          document.getElementById('editBtn').innerHTML = '✏️ Edit & Republish My Video (unlimited submissions)';
        } else {
          editSections.style.display = 'block';
          document.getElementById('editBtn').innerHTML = '❌ Hide Edit Options';
          editSections.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
    
    // Finalize button handler
    function setupFinalizeButton() {
      document.getElementById('finalizeBtn').addEventListener('click', () => {
        openConfirmModal('finalize');
      });
    }
    
    // Share button handler
    document.getElementById('shareBtn').addEventListener('click', async () => {
      openShareModal();
    });

    // Deliver to Coordinator button handler
    document.getElementById('deliverBtn').addEventListener('click', () => {
      openConfirmModal('deliver');
    });

    // Open deliver modal
    function openDeliverModal() {
      document.getElementById('deliverModal').classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    // Close deliver modal
    function closeDeliverModal() {
      document.getElementById('deliverModal').classList.remove('show');
      document.body.style.overflow = 'auto';
      document.getElementById('deliverForm').reset();
      document.querySelectorAll('.modal-form-group input').forEach(input => {
        input.classList.remove('error');
      });
    }

    // Submit delivery
    async function submitDelivery() {
      const firstName = document.getElementById('coordFirstName').value.trim();
      const lastName = document.getElementById('coordLastName').value.trim();
      const orgName = document.getElementById('coordOrgName').value.trim();
      const email = document.getElementById('coordEmail').value.trim();
  
     // Validation
     let hasError = false;
  
     if (!firstName) {
       document.getElementById('coordFirstName').classList.add('error');
       hasError = true;
     } else {
       document.getElementById('coordFirstName').classList.remove('error');
     }
  
     if (!lastName) {
       document.getElementById('coordLastName').classList.add('error');
       hasError = true;
     } else {
       document.getElementById('coordLastName').classList.remove('error');
     }
  
     if (!orgName) {
       document.getElementById('coordOrgName').classList.add('error');
       hasError = true;
     } else {
       document.getElementById('coordOrgName').classList.remove('error');
     }
  
     if (!email || !email.includes('@')) {
       document.getElementById('coordEmail').classList.add('error');
       hasError = true;
     } else {
       document.getElementById('coordEmail').classList.remove('error');
     }
  
     if (hasError) {
       showToast('Please fill in all required fields correctly', 'error');
       return;
     }
  
     const submitBtn = document.getElementById('deliverSubmitBtn');
     submitBtn.disabled = true;
     submitBtn.textContent = '📤 Sending...';
  
     try {
       console.log('[DELIVER] Sending to coordinator:', {
         jobId,
         firstName,
         lastName,
         orgName,
         email
      });
    
      // Real API call
      const response = await fetch(`${API_BASE}/jobs/${jobId}/deliver-to-coordinator`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        orgName: orgName,
        email: email
      })
    });

if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error || 'Failed to deliver video');
}

const result = await response.json();
console.log('[DELIVER] Success:', result);

showToast('✅ Video successfully delivered to ' + email, 'success');
closeDeliverModal();
    
    } catch (error) {
      console.error('[DELIVER ERROR]', error);
      showToast('Failed to deliver video: ' + error.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '📤 Send to Coordinator';
    }
  }

  // Close modal when clicking outside
  document.getElementById('deliverModal').addEventListener('click', (e) => {
    if (e.target.id === 'deliverModal') {
      closeDeliverModal();
    }
  });
    
  // Help Needed button handler
  document.getElementById('helpBtn').addEventListener('click', () => {
    openHelpModal();
  });

  // Open help modal
  function openHelpModal() {
    document.getElementById('helpModal').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  // Close help modal
  function closeHelpModal() {
    document.getElementById('helpModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('helpForm').reset();
    document.querySelectorAll('#helpForm .modal-form-group input').forEach(input => {
      input.classList.remove('error');
    });
  }

  // Submit help request
  async function submitHelp() {
    const firstName = document.getElementById('helpFirstName').value.trim();
    const lastName = document.getElementById('helpLastName').value.trim();
    const email = document.getElementById('helpEmail').value.trim();
    const message = document.getElementById('helpMessage').value.trim();

    // Validation
    let hasError = false;

    if (!firstName) {
      document.getElementById('helpFirstName').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('helpFirstName').classList.remove('error');
    }

    if (!lastName) {
      document.getElementById('helpLastName').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('helpLastName').classList.remove('error');
    } 

    if (!email || !email.includes('@')) {
      document.getElementById('helpEmail').classList.add('error');
      hasError = true;
    } else {
      document.getElementById('helpEmail').classList.remove('error');
    }

    if (!message) {
      document.getElementById('helpMessage').style.borderColor = '#f44336';
      hasError = true;
    } else {
      document.getElementById('helpMessage').style.borderColor = '#e0e0e0';
    }

    if (hasError) {
      showToast('Please fill in all required fields correctly', 'error');
      return;
    }

    const submitBtn = document.getElementById('helpSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '✉️ Sending...';

    try {
      console.log('[HELP] Sending help request:', {
        jobId,
        firstName,
        lastName,
        email
      });

      // Real API call
      const response = await fetch(`${API_BASE}/jobs/${jobId}/request-help`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          message: message
        })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send help request');
    }

    const result = await response.json();
    console.log('[HELP] Success:', result);

    showToast('✅ Help request form sent to ' + email, 'success');
    closeHelpModal();

    } catch (error) {
      console.error('[HELP ERROR]', error);
      showToast('Failed to send help request: ' + error.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '✉️ Send me a help request form';
    }
  }

  // Close modal when clicking outside
  document.getElementById('helpModal').addEventListener('click', (e) => {
    if (e.target.id === 'helpModal') {
      closeHelpModal();
    }
  });

  // Share Modal Functions
  let recipientCount = 0;
  let recipients = [];

  // Open share modal
  function openShareModal() {
    document.getElementById('shareModal').classList.add('show');
    document.body.style.overflow = 'hidden';
  
    // Initialize with one recipient if empty
    if (recipientCount === 0) {
      addRecipient();
    }
  }

  // Close share modal
  function closeShareModal() {
    document.getElementById('shareModal').classList.remove('show');
    document.body.style.overflow = 'auto';
  
    // Reset recipients
    recipientCount = 0;
    recipients = [];
    document.getElementById('recipientsList').innerHTML = '';
  }

  // Add recipient
  function addRecipient() {
    recipientCount++;
    const recipientId = `recipient-${recipientCount}`;
  
    const recipientHtml = `
      <div class="recipient-item ${recipientCount === 1 ? '' : 'last'}" id="${recipientId}">
        <div class="recipient-number">${recipientCount}</div>
        ${recipientCount > 1 ? `<button type="button" class="recipient-remove" onclick="removeRecipient('${recipientId}')">×</button>` : ''}
        <div class="recipient-fields">
          <div class="modal-form-row">
            <div class="modal-form-group">
              <label>First Name<span class="required">*</span></label>
              <input type="text" id="${recipientId}-firstName" required placeholder="Jane" class="recipient-input">
            </div>
            <div class="modal-form-group">
              <label>Last Name<span class="required">*</span></label>
              <input type="text" id="${recipientId}-lastName" required placeholder="Smith" class="recipient-input">
            </div>
          </div>
          <div class="modal-form-group">
            <label>Email Address<span class="required">*</span></label>
            <input type="email" id="${recipientId}-email" required placeholder="jane@example.com" class="recipient-input">
          </div>
        </div>
      </div>
    `;
  
    // Remove 'last' class from all items
    document.querySelectorAll('.recipient-item').forEach(item => {
      item.classList.remove('last');
    });
  
    document.getElementById('recipientsList').insertAdjacentHTML('beforeend', recipientHtml);
  
    // Add 'last' class to the newly added item
    document.getElementById(recipientId).classList.add('last');
  }

  // Remove recipient
  function removeRecipient(recipientId) {
    const item = document.getElementById(recipientId);
    if (item) {
      item.remove();
      recipientCount--;
    
      // Renumber remaining recipients
      const items = document.querySelectorAll('.recipient-item');
      items.forEach((item, index) => {
        const number = item.querySelector('.recipient-number');
        if (number) {
          number.textContent = index + 1;
        }
      
        // Add 'last' class only to the last item
        item.classList.remove('last');
        if (index === items.length - 1) {
          item.classList.add('last');
        }
      });
    }
  }

  // Submit share
  async function submitShare() {
    const recipientItems = document.querySelectorAll('.recipient-item');
    const recipientData = [];
    let hasError = false;
  
    recipientItems.forEach(item => {
      const id = item.id;
      const firstName = document.getElementById(`${id}-firstName`);
      const lastName = document.getElementById(`${id}-lastName`);
      const email = document.getElementById(`${id}-email`);
    
      // Validation
      if (!firstName.value.trim()) {
        firstName.classList.add('error');
        hasError = true;
      } else {
        firstName.classList.remove('error');
      }
    
      if (!lastName.value.trim()) {
        lastName.classList.add('error');
        hasError = true;
      } else {
        lastName.classList.remove('error');
      }
    
      if (!email.value.trim() || !email.value.includes('@')) {
        email.classList.add('error');
        hasError = true;
      } else {
        email.classList.remove('error');
      }
    
      if (firstName.value.trim() && lastName.value.trim() && email.value.trim()) {
        recipientData.push({
          firstName: firstName.value.trim(),
          lastName: lastName.value.trim(),
          email: email.value.trim()
        });
      }
    });
  
    if (hasError) {
      showToast('Please fill in all required fields correctly', 'error');
      return;
    }
  
    if (recipientData.length === 0) {
      showToast('Please add at least one recipient', 'error');
      return;
    }
  
    const submitBtn = document.getElementById('shareSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '📤 Sending...';
  
    try {
      console.log('[SHARE] Sending invitations to:', {
        jobId,
        recipients: recipientData
      });
    
      // Real API call
      const response = await fetch(`${API_BASE}/jobs/${jobId}/share-with-recipients`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          recipients: recipientData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invitations');
      }

      const result = await response.json();
      console.log('[SHARE] Success:', result);

      const recipientCount = recipientData.length;
      const recipientWord = recipientCount === 1 ? 'recipient' : 'recipients';
      showToast(`✅ Invitations sent to ${recipientCount} ${recipientWord}`, 'success');
      closeShareModal();
    
    } catch (error) {
      console.error('[SHARE ERROR]', error);
      showToast('Failed to send invitations: ' + error.message, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '📤 Send Invitations';
    }
  }

  // Close modal when clicking outside
  document.getElementById('shareModal').addEventListener('click', (e) => {
    if (e.target.id === 'shareModal') {
      closeShareModal();
    }
  });
    
    // Edit section expansion
    document.querySelectorAll('.edit-option-header').forEach(header => {
      header.addEventListener('click', () => {
        const option = header.closest('.edit-option');
        option.classList.toggle('expanded');
      });
    });
    
    // Track form changes
    function trackChange(fieldName, value) {
      if (value === '' || value === null || value === undefined) {
        delete pendingChanges[fieldName];
      } else {
        pendingChanges[fieldName] = value;
      }
      updateResubmitButton();
      console.log('[CHANGES]', pendingChanges);
    }
    
    // Update resubmit button state
    function updateResubmitButton() {
      const btn = document.getElementById('resubmitBtn');
      btn.onclick = calculateVideo;
      const hasChanges = Object.keys(pendingChanges).length > 0;
      btn.disabled = !hasChanges;
  
      // Updated text to match calculation flow
      btn.textContent = '📊 Review My Video Plan (Submit)';
    }
    
    // Transition preview video mapping
    const TRANSITION_VIDEOS = {
      'simple-fade-wipe': 'https://www.dropbox.com/scl/fi/368hwkwqhtks5v9e3j1es/Transition-Examples-Simple-Fade-and-Wipe-3.mp4?rlkey=nvwfk02kf55096zyoquc85u3c&st=9deaz85e&dl=1',
      'pages-of-life': 'https://www.dropbox.com/scl/fi/o285ltxtsrpqws5gvaw3h/Transition-Examples-Pages-of-Life-2.mp4?rlkey=xkhdb1oa8wd0m46vgewi3gp9f&st=zv8vokof&dl=1',
      'floating-frames': 'https://www.dropbox.com/scl/fi/l7ifvko5rdumtp2ssa1cb/Transition-Examples-Floating-Frames-2.mp4?rlkey=seyficxdrpnu9vmg63ydbw09i&st=lgbll6sa&dl=1',
      'zoom-through': 'https://www.dropbox.com/scl/fi/xbochmmlgl0v430lo7l6q/Transition-Examples-Zoom-Through-2.mp4?rlkey=kkgfphukmjg2sa8m69egd36nq&st=9hr8hm8c&dl=1',
      'blinds-combs-bars': 'https://www.dropbox.com/scl/fi/yu49ywzg9lnpfvbkpngun/Transition-Examples-Blinds-Combs-Bars-2.mp4?rlkey=itoxqenf61i2cm746kvn2fjbl&st=wk0xl254&dl=1'
    };

    // Setup change tracking for all form elements
    document.getElementById('visualPackage').addEventListener('change', (e) => {
      const selectedValue = e.target.value;
      const videoSource = document.getElementById('transitionPreviewSource');
      const video = document.getElementById('transitionPreview');
  
      if (selectedValue && TRANSITION_VIDEOS[selectedValue]) {
        videoSource.src = TRANSITION_VIDEOS[selectedValue];
        video.load();
      }
  
      trackChange('visualPackage', e.target.value);
    });
    
    document.querySelectorAll('input[name="timingMode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const mode = e.target.value;
        handleTimingModeChange(mode);
        trackChange('timingMode', mode);
    
        // Handle Song Logic section based on timing mode
        const songLogicSection = document.querySelector('[data-section="songlogic"]');
        const musicDistSelect = document.getElementById('musicDistribution');
    
        if (mode === 'fitToSongs') {
          // Disable Song Logic section when Fit to Music is selected
          if (songLogicSection) {
            songLogicSection.style.opacity = '0.5';
            songLogicSection.style.pointerEvents = 'none';
          }
          musicDistSelect.value = '';
          delete pendingChanges.musicDistribution;
          delete pendingChanges.songRanges;
          document.getElementById('songRangesContainer').style.display = 'none';
          updateResubmitButton();
        } else {
          // Re-enable Song Logic section
          if (songLogicSection) {
            songLogicSection.style.opacity = '1';
            songLogicSection.style.pointerEvents = 'auto';
          }
        }
    
        if (mode === 'perSlide') {
          trackChange('perSlideSec', document.getElementById('perSlideSec').value);
        } else if (mode === 'fixedRuntime') {
          trackChange('fixedRuntimeSec', document.getElementById('fixedRuntimeSec').value);
        }

        calculateVideoDuration();
      });
    });
    
    function handleTimingModeChange(mode) {
      document.getElementById('perSlideInput').style.display = 'none';
      document.getElementById('fixedRuntimeInput').style.display = 'none';
  
      // Handle the fit to music notice
      const fitToMusicNotice = document.getElementById('fitToMusicNotice');
      const musicDistSelect = document.getElementById('musicDistribution');
  
      if (mode === 'fitToSongs') {
        if (fitToMusicNotice) fitToMusicNotice.style.display = 'block';
        musicDistSelect.disabled = true;
      } else {
        if (fitToMusicNotice) fitToMusicNotice.style.display = 'none';
        musicDistSelect.disabled = false;
      }
  
      document.querySelectorAll('.radio-option').forEach(opt => {
        opt.classList.remove('selected');
      });
  
      const selectedRadio = document.querySelector(`input[name="timingMode"][value="${mode}"]`);
      if (selectedRadio) {
        selectedRadio.closest('.radio-option').classList.add('selected');
    
        if (mode === 'perSlide') {
          document.getElementById('perSlideInput').style.display = 'block';
        } else if (mode === 'fixedRuntime') {
          document.getElementById('fixedRuntimeInput').style.display = 'block';
        }
     }
  }
    
    document.getElementById('perSlideSec').addEventListener('input', (e) => {
      trackChange('perSlideSec', parseFloat(e.target.value));
      calculateVideoDuration();
    });
    
    document.getElementById('fixedRuntimeSec').addEventListener('input', (e) => {
      trackChange('fixedRuntimeSec', parseFloat(e.target.value));
      calculateVideoDuration();
    });

    
    document.getElementById('musicDistribution').addEventListener('change', (e) => {
      const value = e.target.value;
  
      // Check if Fit to Music is selected
      const timingMode = document.querySelector('input[name="timingMode"]:checked')?.value;
      if (timingMode === 'fitToSongs') {
        showToast('"Fit to Music Length" determines your Song Logic automatically', 'error');
        e.target.value = ''; // Reset selection
        return;
      }
  
      trackChange('musicDistribution', value);
      handleMusicDistributionChange(value);
    });

    // ========== CALCULATION FUNCTIONS ==========
    
    // Calculate video before submission
    async function calculateVideo() {
      console.log('[CALCULATE] Starting calculation...');
      
      // Show loading overlay
      showLoading(true);
      
      try {
        // ✅ FIX: Determine presentation type correctly
        let presentationType;
        let presentationSource;
        
        // If new PowerPoint file is uploaded, always use powerpoint_file
        if (newPptxFile) {
          console.log('[CALCULATE] New PowerPoint file detected, uploading...');
          presentationSource = await uploadPowerPointForCalculation(jobId, newPptxFile);
          presentationType = 'powerpoint_file';  // ✅ THIS IS THE KEY FIX
        } 
        // Otherwise, determine from current settings
        else if (currentSettings.provider === 'google_slides') {
          presentationType = 'google_slides';
          presentationSource = currentSettings.original_url;
        } 
        else if (currentSettings.provider === 'powerpoint') {
          // ✅ Check if original was a file upload or URL
          // File uploads have paths like /input/ or /temp-uploads/
          if (currentSettings.original_url && 
              (currentSettings.original_url.includes('/input/') || 
               currentSettings.original_url.includes('/temp-uploads/'))) {
            presentationType = 'powerpoint_file';
          } else {
            presentationType = 'powerpoint_url';
          }
          presentationSource = currentSettings.original_url;
        } 
        else {
          // Fallback to checking pending changes
          presentationType = pendingChanges.presentationType || currentSettings.provider;
          presentationSource = pendingChanges.presentationUrl || currentSettings.original_url;
        }
        
        if (!presentationType || !presentationSource) {
          showLoading(false);
          alert('Could not determine presentation type. Please try again.');
          return;
        }
        
        console.log('[CALCULATE] Calling Lambda...', {
          jobId: jobId,
          presentationType: presentationType,
          presentationSource: presentationSource
        });
        
        // Call the calculation Lambda (same one used by main form)
        const response = await fetch(`${API_BASE}/jobs/${jobId}/calculate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            presentationType: presentationType,
            presentationSource: presentationSource
          })
        });
        
        const result = await response.json();
        console.log('[CALCULATE] Lambda response:', result);
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to calculate video');
        }
        
        const slideCount = result.slideCount;
        
        // STEP 3: Calculate duration based on timing mode and songs
        const timingMode = document.querySelector('input[name="timingMode"]:checked').value;
        let estimatedSeconds = 0;
        let durationText = '';
        let summaryText = '';
        
        // Calculate total music duration
        let totalMusicSeconds = 0;
        for (const song of currentSongs) {
          let songSeconds = 0;
  
        if (typeof song.duration === 'string') {
          // Library song: convert "4:32" to seconds
          const parts = song.duration.split(':');
          songSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (typeof song.duration === 'number') {
          // Custom uploaded song: already in seconds
          songSeconds = song.duration;
        } else {
          // No duration yet (custom song still loading): default 3 min
          songSeconds = 180;
        }
  
        totalMusicSeconds += songSeconds;
      }
        
        if (timingMode === 'fixedRuntime') {
          estimatedSeconds = parseInt(document.getElementById('fixedRuntimeSec').value) || 350;
          const minutes = Math.floor(estimatedSeconds / 60);
          const seconds = estimatedSeconds % 60;
          durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          // Calculate time range (± 9 seconds)
          const minSeconds = Math.max(0, estimatedSeconds - 9);
          const maxSeconds = estimatedSeconds + 9;
          const minMinutes = Math.floor(minSeconds / 60);
          const minSecs = minSeconds % 60;
          const maxMinutes = Math.floor(maxSeconds / 60);
          const maxSecs = maxSeconds % 60;
          const minTime = `${minMinutes}:${minSecs.toString().padStart(2, '0')}`;
          const maxTime = `${maxMinutes}:${maxSecs.toString().padStart(2, '0')}`;
          
          const perSlide = (estimatedSeconds / slideCount).toFixed(1);
          
          // Get visual package and music distribution
          const visualPackage = document.getElementById('visualPackage').value;
          const visualPackageNames = {
            'simple-fade-wipe': 'Simple Fade & Wipe',
            'pages-of-life': 'Pages of Life',
            'floating-frames': 'Floating Frames',
            'zoom-through': 'Zoom Through',
            'blinds-combs-bars': 'Blinds, Combs & Bars'
          };
          const visualName = visualPackageNames[visualPackage] || visualPackage;
          
          const musicDistribution = document.getElementById('musicDistribution').value;
          const distributionNames = {
            'evenlyDistributed': 'Evenly Distributed',
            'specifyPlacement': 'Specify Placement'
          };
          const distributionName = distributionNames[musicDistribution] || 'Evenly Distributed';
          
          const songCount = currentSongs.length;
          const songText = songCount === 1 ? '1 song' : `${songCount} songs`;
          
          summaryText = `The video between ${minTime} and ${maxTime} uses Fixed Runtime mode with ${slideCount} slides (approximately ${perSlide} seconds per slide), ${visualName} transitions, and ${songText} (${distributionName}).`;
          
       } else if (timingMode === 'perSlide') {
          const perSlide = parseInt(document.getElementById('perSlideSec').value) || 5;
          estimatedSeconds = (slideCount * perSlide) + (perSlide * 2); // Add 2x for first & last slides
          const minutes = Math.floor(estimatedSeconds / 60);
          const seconds = estimatedSeconds % 60;
          durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          // Calculate time range (± 9 seconds)
          const minSeconds = Math.max(0, estimatedSeconds - 9);
          const maxSeconds = estimatedSeconds + 9;
          const minMinutes = Math.floor(minSeconds / 60);
          const minSecs = minSeconds % 60;
          const maxMinutes = Math.floor(maxSeconds / 60);
          const maxSecs = maxSeconds % 60;
          const minTime = `${minMinutes}:${minSecs.toString().padStart(2, '0')}`;
          const maxTime = `${maxMinutes}:${maxSecs.toString().padStart(2, '0')}`;
          
          // Get visual package and music distribution
          const visualPackage = document.getElementById('visualPackage').value;
          const visualPackageNames = {
            'simple-fade-wipe': 'Simple Fade & Wipe',
            'pages-of-life': 'Pages of Life',
            'floating-frames': 'Floating Frames',
            'zoom-through': 'Zoom Through',
            'blinds-combs-bars': 'Blinds, Combs & Bars'
          };
          const visualName = visualPackageNames[visualPackage] || visualPackage;
          
          const musicDistribution = document.getElementById('musicDistribution').value;
          const distributionNames = {
            'evenlyDistributed': 'Evenly Distributed',
            'specifyPlacement': 'Specify Placement'
          };
          const distributionName = distributionNames[musicDistribution] || 'Evenly Distributed';
          
          const songCount = currentSongs.length;
          const songText = songCount === 1 ? '1 song' : `${songCount} songs`;
          
          summaryText = `The video between ${minTime} and ${maxTime} uses Per Slide Duration mode with ${slideCount} slides at ${perSlide} seconds per slide, ${visualName} transitions, and ${songText} (${distributionName}).`;
          
        } else if (timingMode === 'fitToSongs') {
          estimatedSeconds = totalMusicSeconds;
          const minutes = Math.floor(estimatedSeconds / 60);
          const seconds = estimatedSeconds % 60;
          durationText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          
          // Calculate time range (± 9 seconds)
          const minSeconds = Math.max(0, estimatedSeconds - 9);
          const maxSeconds = estimatedSeconds + 9;
          const minMinutes = Math.floor(minSeconds / 60);
          const minSecs = minSeconds % 60;
          const maxMinutes = Math.floor(maxSeconds / 60);
          const maxSecs = maxSeconds % 60;
          const minTime = `${minMinutes}:${minSecs.toString().padStart(2, '0')}`;
          const maxTime = `${maxMinutes}:${maxSecs.toString().padStart(2, '0')}`;
          
          const perSlide = (estimatedSeconds / slideCount).toFixed(1);
          
          // Get visual package
          const visualPackage = document.getElementById('visualPackage').value;
          const visualPackageNames = {
            'simple-fade-wipe': 'Simple Fade & Wipe',
            'pages-of-life': 'Pages of Life',
            'floating-frames': 'Floating Frames',
            'zoom-through': 'Zoom Through',
            'blinds-combs-bars': 'Blinds, Combs & Bars'
          };
          const visualName = visualPackageNames[visualPackage] || visualPackage;
          
          const songCount = currentSongs.length;
          const songText = songCount === 1 ? '1 song' : `${songCount} songs`;
          
          summaryText = `The video between ${minTime} and ${maxTime} uses Fit to Music Length mode with ${slideCount} slides (approximately ${perSlide} seconds per slide), ${visualName} transitions, and ${songText} (automatically distributed to match music length).`;
        }
        
        // Show modal with results
        showCalculationModal(slideCount, durationText, summaryText);
        
      } catch (error) {
        console.error('[CALCULATE ERROR]', error);
        showLoading(false);
        alert(`Failed to calculate video: ${error.message}`);
      }
    }
    
    // Upload PowerPoint file for calculation only
    async function uploadPowerPointForCalculation(jobId, file) {
      console.log('[CALCULATE UPLOAD] Uploading PowerPoint to temp location...');
      
      const urlResponse = await fetch(`${API_BASE}/generate-upload-url`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jobId: jobId,
          fileType: 'presentation',
          fileExtension: 'pptx'
        })
      });
      
      if (!urlResponse.ok) throw new Error('Failed to get PowerPoint upload URL');
      
      const {uploadUrl, s3Key} = await urlResponse.json();
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'},
        body: file
      });
      
      if (!uploadResponse.ok) throw new Error('Failed to upload PowerPoint');
      
      // Return S3 URL
      const s3Url = `https://order-by-age-uploads.s3.us-east-2.amazonaws.com/${s3Key}`;
      console.log('[CALCULATE UPLOAD] PowerPoint uploaded:', s3Url);
      return s3Url;
    }
    
    // Show calculation modal
    function showCalculationModal(slideCount, duration, summaryText) {
      showLoading(false); // Hide loading overlay
      
      // Parse the duration (format: "M:SS")
      const parts = duration.split(':');
      const minutes = parseInt(parts[0]);
      const seconds = parseInt(parts[1]);
      const totalSeconds = (minutes * 60) + seconds;
      
      // Calculate range (± 9 seconds)
      const minSeconds = Math.max(0, totalSeconds - 9);
      const maxSeconds = totalSeconds + 9;
      
      // Convert back to M:SS format
      const minMinutes = Math.floor(minSeconds / 60);
      const minSecs = minSeconds % 60;
      const maxMinutes = Math.floor(maxSeconds / 60);
      const maxSecs = maxSeconds % 60;
      
      const minTime = `${minMinutes}:${minSecs.toString().padStart(2, '0')}`;
      const maxTime = `${maxMinutes}:${maxSecs.toString().padStart(2, '0')}`;
      
      const durationRange = `${minTime} - ${maxTime}`;
      
      document.getElementById('modalSlideCount').textContent = `${slideCount} slides`;
      document.getElementById('modalDuration').textContent = durationRange;
      document.getElementById('modalSummary').textContent = summaryText;

      document.getElementById('calculationModal').classList.add('show');
    }
    // Close calculation modal
    function closeCalculationModal() {
      document.getElementById('calculationModal').classList.remove('show');
    }

    // Close modal when clicking outside - wrapped to run after DOM loads
    window.addEventListener('DOMContentLoaded', function() {
      const calcModal = document.getElementById('calculationModal');
      if (calcModal) {
        calcModal.addEventListener('click', (e) => {
          if (e.target.id === 'calculationModal') {
            closeCalculationModal();
          }
        });
      }
    });
    
    // ========== END CALCULATION FUNCTIONS ==========
    // Show/hide loading overlay
    function showLoading(show) {
      const overlay = document.getElementById('loadingOverlay');
      if (show) {
        overlay.classList.add('show');
      } else {
        overlay.classList.remove('show');
      }
    }
    // Final submit function (called from calculation modal)
    async function finalSubmit() {
      // Close the calculation modal
      closeCalculationModal();
      
      if (Object.keys(pendingChanges).length === 0) {
        showToast('No changes to submit', 'error');
        return;
      }
      
      const confirmed = confirm(
        `Create a new video with ${Object.keys(pendingChanges).length} change(s)?\n\n` +
        'You will receive an email in 5-15 minutes with your new video.'
      );
      
      if (!confirmed) return;
      
      try {
        showToast('Uploading files...', 'success');
        console.log('[RESUBMIT] Preparing submission...');
        
        // Build settings from form values (form is pre-populated for user convenience)
        // ✅ FIX: If this is a shared view, use the shared user's email/name from URL
        const customerEmail = isSharedView ? urlParams.get('email') : currentSettings.customerEmail;
        const customerName = isSharedView ? urlParams.get('name') : currentSettings.fullName;

        const completeSettings = {
          customerEmail: customerEmail,
          fullName: customerName,
          provider: currentSettings.provider,
          original_url: currentSettings.original_url,
          timingMode: document.querySelector('input[name="timingMode"]:checked')?.value || 'perSlide',
          perSlideSec: parseFloat(document.getElementById('perSlideSec').value) || 5,
          fixedRuntimeSec: parseFloat(document.getElementById('fixedRuntimeSec').value) || 350,
          visualPackage: document.getElementById('visualPackage').value || 'simple-fade-wipe',
          musicDistribution: document.getElementById('musicDistribution').value || 'evenlyDistributed',
          songOrder: currentSongs.map(s => s.name),
          audioCount: currentSongs.length
        };

        // ✅ ONLY ADD SONG RANGES IF musicDistribution is specifyPlacement AND they exist in pendingChanges
        if (completeSettings.musicDistribution === 'specifyPlacement' && pendingChanges.songRanges && pendingChanges.songRanges.length > 0) {
          completeSettings.songRanges = pendingChanges.songRanges;
          console.log('[RESUBMIT] Including songRanges:', pendingChanges.songRanges);
        } else {
          // ✅ EXPLICITLY REMOVE songRanges if not using specifyPlacement
          delete completeSettings.songRanges;
          console.log('[RESUBMIT] Removed songRanges (not using specifyPlacement)');
        }

        console.log('[RESUBMIT] Complete settings:', completeSettings);
        
        const submitData = {
          originalJobId: jobId,
          changes: completeSettings
        };

        // ✅ ADD THIS BLOCK:
        if (isSharedView) {
          const sharedByEmail = urlParams.get('email');
          const sharedByName = urlParams.get('name');
  
          submitData.sharedBy = {
            email: sharedByEmail,
            name: sharedByName
        };
      }
        
        // STEP 1: Upload PowerPoint file to S3 if present
        if (newPptxFile) {
          console.log('[UPLOAD] Getting presigned URL for PowerPoint...');
          
          const urlResponse = await fetch(`${API_BASE}/generate-upload-url`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              jobId: jobId,
              fileType: 'presentation',
              fileExtension: 'pptx'
            })
          });
          
          if (!urlResponse.ok) throw new Error('Failed to get PowerPoint upload URL');
          
          const {uploadUrl, s3Key} = await urlResponse.json();
          
          console.log('[UPLOAD] Uploading PowerPoint to S3...');
          
          const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'},
            body: newPptxFile
          });
          
          if (!uploadResponse.ok) throw new Error('Failed to upload PowerPoint');
          
          submitData.changes.newPresentationS3Key = s3Key;
          console.log('[UPLOAD] PowerPoint uploaded successfully');
        }
        
        // STEP 2: Upload new songs to S3 if present
        const newSongFiles = currentSongs.filter(s => s.isNew && s.file);
        
        if (newSongFiles.length > 0) {
          const uploadedSongs = [];
          
          for (let i = 0; i < newSongFiles.length; i++) {
            const song = newSongFiles[i];
            
            console.log(`[UPLOAD] Getting presigned URL for song ${i + 1}...`);
            
            const urlResponse = await fetch(`${API_BASE}/generate-upload-url`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                jobId: jobId,
                fileType: 'song',
                fileNumber: i + 1,
                fileExtension: 'mp3'
              })
            });
            
            if (!urlResponse.ok) throw new Error(`Failed to get upload URL for song ${i + 1}`);
            
            const {uploadUrl, s3Key} = await urlResponse.json();
            
            console.log(`[UPLOAD] Uploading song ${i + 1} to S3...`);
            
            const uploadResponse = await fetch(uploadUrl, {
              method: 'PUT',
              headers: {'Content-Type': 'audio/mpeg'},
              body: song.file
            });
            
            if (!uploadResponse.ok) throw new Error(`Failed to upload song ${i + 1}`);
            
            uploadedSongs.push({
              originalName: song.name,
              s3Key: s3Key
            });
            
            console.log(`[UPLOAD] Song ${i + 1} uploaded successfully`);
          }
          
          submitData.changes.newSongs = uploadedSongs;
          console.log('[UPLOAD] All songs uploaded');
        }
        
        // Add manualEditsRequested flag if it was set
        if (pendingChanges.manualEditsRequested) {
          submitData.changes.manualEditsRequested = true;
        }
        
        // STEP 3: Submit metadata to resubmit API
        console.log('[RESUBMIT] Submitting to API...');
        console.log('[RESUBMIT] Payload:', JSON.stringify(submitData, null, 2));
        showToast('Processing changes...', 'success');
        
        const response = await fetch(`${API_BASE}/jobs/${jobId}/resubmit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(submitData)
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.details || `HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log('[RESUBMIT] Success:', result);
        
        // Show thank you overlay
        document.getElementById('resubmitThankYouOverlay').style.display = 'block';

        // Hide the main container
        document.querySelector('.container').style.display = 'none';

        // Clear changes
        pendingChanges = {};
        newPptxFile = null;
        
      } catch (error) {
        console.error('[RESUBMIT ERROR]', error);
        showToast('Failed to resubmit: ' + error.message, 'error');
      }
    }

    // Confirmation Modal State
    let confirmModalAction = null; // 'deliver' or 'finalize'

    // Open confirmation modal
    function openConfirmModal(action) {
      confirmModalAction = action;
      const modal = document.getElementById('confirmModal');
      const title = document.getElementById('confirmModalTitle');
      const subtitle = document.getElementById('confirmModalSubtitle');
      const message = document.getElementById('confirmModalMessage');
      const proceedBtn = document.getElementById('confirmProceedBtn');
      const header = document.getElementById('confirmModalHeader');
    
      // Get video URL from current video
      const currentVideo = document.querySelector('.video-wrapper video');
      const videoUrl = currentVideo ? currentVideo.querySelector('source').src : '';
    
      // Set video source
      document.getElementById('confirmVideoSource').src = videoUrl;
      document.getElementById('confirmVideo').load();
    
      // Customize based on action
      if (action === 'deliver') {
        header.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        title.innerHTML = '⛪️ Confirm Video for Coordinator';
        subtitle.textContent = 'Please review your video before sending';
        message.innerHTML = '📧 Can you confirm this is the video you wish to send to your event coordinator?';
        proceedBtn.innerHTML = '✅ Yes, Continue to Delivery';
        proceedBtn.className = 'modal-btn modal-btn-primary';
      } else if (action === 'finalize') {
        header.style.background = 'linear-gradient(135deg, #2196F3 0%, #0b7dda 100%)';
        title.innerHTML = '✅ Confirm Final Video';
        subtitle.textContent = 'Please review your video before finalizing';
        message.innerHTML = '🎬 Can you confirm this is the final video you wish to submit? You won\'t be able to make anymore edits after this.';
        proceedBtn.innerHTML = '✅ Yes, Continue to Finalize';
        proceedBtn.className = 'modal-btn modal-btn-info';
      }
    
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    // Close confirmation modal
    function closeConfirmModal() {
      const modal = document.getElementById('confirmModal');
      const video = document.getElementById('confirmVideo');
    
      // Pause video
      video.pause();
      video.currentTime = 0;
    
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
      confirmModalAction = null;
    }

    // Proceed from confirmation
    function proceedFromConfirm() {
      console.log('[CONFIRM] Action:', confirmModalAction);
  
      // SAVE the action BEFORE closing (which resets it to null)
      const actionToTake = confirmModalAction;
  
      closeConfirmModal();
  
      // Add a small delay to ensure modal closes before opening next one
      setTimeout(() => {
        console.log('[CONFIRM] Proceeding with action:', actionToTake);
    
        if (actionToTake === 'deliver') {
          console.log('[CONFIRM] Opening deliver modal...');
          const deliverModal = document.getElementById('deliverModal');
          deliverModal.classList.add('show');
          document.body.style.overflow = 'hidden';
        } else if (actionToTake === 'finalize') {
          console.log('[CONFIRM] Finalizing video...');
          finalizeVideoDirectly();
        }
      }, 300);
    }

    // Finalize video directly (extracted from original button handler)
    async function finalizeVideoDirectly() {
      const confirmed = confirm(
        "Final confirmation: You won't be able to make anymore edits to the final video. " +
        "You will also be emailed a final copy as a backup."
      );
    
      if (!confirmed) return;
    
      try {
        await downloadVideo(jobId);
      
        showToast('Finalizing your order...', 'success');
        const response = await fetch(`${API_BASE}/jobs/${jobId}/finalize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      
        if (!response.ok) {
          throw new Error('Failed to finalize order');
        }
      
        const finalizedUrl = `${window.location.origin}${window.location.pathname}?job=${jobId}&finalized=true`;
        history.replaceState(null, '', finalizedUrl);
        location.reload();
      
      } catch (error) {
        console.error('[FINALIZE ERROR]', error);
        showToast('Download started, but email failed. Please contact support.', 'error');
      }
    }

    // Close modal when clicking outside
    document.getElementById('confirmModal').addEventListener('click', (e) => {
      if (e.target.id === 'confirmModal') {
        closeConfirmModal();
      }
    });
    // Music terms modal functions
    function showMusicTermsModal(e) {
      e.preventDefault();
      document.getElementById('musicTermsModal').classList.add('show');
    }

    function cancelMusicUpload() {
      document.getElementById('musicTermsModal').classList.remove('show');
      document.getElementById('newSongUpload').value = ''; // Clear file input
    }

    function acceptMusicTerms() {
      document.getElementById('musicTermsModal').classList.remove('show');
      // Trigger the file input
      document.getElementById('newSongUpload').click();
    }
    
  </script>
