/** @type {import("next").NextConfig} */

const removeProtocol = (url) => {
   return url.replace(/(^\w+:|^)\/\//, '');
};

const nextConfig = {
   experimental: {
      staleTimes: {
         dynamic: 0,
         static: 0
      },
      // Disable Server Actions origin check for payment callbacks
      serverActions: {
         allowedOrigins: ['3dsecure.gpwebpay.com', 'test.3dsecure.gpwebpay.com', 'store.fenixcraft.cz'],
         skipOriginCheck: true
      }
   },
   images: {
      remotePatterns: [
         {
            hostname: 'mc-heads.net'
         },
         {
            hostname: 'minotar.net'
         },
         {
            hostname: 'hyvatar.io'
         },
         {
            hostname: removeProtocol(process.env.NEXT_PUBLIC_API_URL)
         },
         {
            hostname: 'i.imgur.com'
         },
         {
            hostname: '127.0.0.1',
            port: '8000',
         }
      ],
      minimumCacheTTL: 30,
   },

   headers: async () => {
      return [
         {
            source: '/payment/flow',
            headers: [
               {
                  key: 'Access-Control-Allow-Origin',
                  value: 'https://3dsecure.gpwebpay.com, https://test.3dsecure.gpwebpay.com'
               },
               {
                  key: 'Access-Control-Allow-Methods',
                  value: 'GET'
               },
               {
                  key: 'Access-Control-Allow-Headers',
                  value: 'Content-Type'
               }
            ]
         },
         {
            // Matching all image formats under /img/categories
            source: '/img/categories/:all*(png|gif|jpeg|jpg)',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=30, must-revalidate'
               }
            ]
         },
         {
            // Matching all image formats under /img/items
            source: '/img/items/:all*(png|gif|jpeg|jpg)',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=30, must-revalidate'
               }
            ]
         },
         {
            // Matching all image formats under /img
            source: '/img/:all*(png|gif|jpeg|jpg)',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=120, must-revalidate'
               }
            ]
         },
         {
            // Matching all image formats under /
            source: '/:all*(png|gif|jpeg|jpg)',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=120, must-revalidate'
               }
            ]
         }
      ];
   },
   rewrites: async () => {
      return [
         {
            source: '/',
            destination: '/home'
         }
      ];
   }
};

module.exports = nextConfig;
