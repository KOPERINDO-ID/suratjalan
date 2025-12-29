
var routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/kunjungan',
    url: './pages/kunjungan.html',
  },
  {
    path: '/login',
    url: './pages/login.html',
  },
  {
    path: '/surat_jalan',
    url: './pages/surat_jalan.html',
  },
  {
    path: '/partner',
    url: './pages/partner.html',
  },
  {
    path: '/produksi',
    url: './pages/produksi.html',
  },
  {
    path: '/produksi-proses',
    url: './pages/produksi-proses.html',
  },
  {
    path: '/produksi-selesai',
    url: './pages/produksi-selesai.html',
  },
  {
    path: '/produksi-harian',
    url: './pages/produksi-harian.html',
  },
  {
    path: '/sales',
    url: './pages/penjualan.html',
  },
  {
    path: '/penjualan-input-single',
    url: './pages/penjualan_input_single.html',
  },
  {
    path: '/performa',
    url: './pages/performa_input.html',
  },
  {
    path: '/penjualan-input',
    url: './pages/penjualan_input.html',
  },
  {
    path: '/penjualan-input-non-performa',
    url: './pages/penjualan_input_non_performa.html',
  },
  {
    path: '/kunjungan-input',
    url: './pages/kunjungan_input.html',
  },
  {
    path: '/katalog',
    url: './pages/katalog.html',
  },
  {
    path: '/detail-product',
    url: './pages/detail_product.html',
  },
  {
    path: '/form/',
    url: './pages/form.html',
  },
  {
    path: '/product/:id/',
    componentUrl: './pages/product.html',
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    componentUrl: './pages/dynamic-route.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
