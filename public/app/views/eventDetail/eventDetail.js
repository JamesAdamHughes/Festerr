angular.module('EventDetailView', ['ngMaterial'])
    .controller('EventDetailCtrl', ['$scope', '$q', 'SpotifyService', EventDetailController]);
    

function EventDetailController($scope, $q, SpotifyService) {
    $scope.eventLiked = true;
    
   $scope.tiles = [
        {
          "artistid": "123501866",
          "name": "Hannah Wants",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/6/123501866_2.jpg"
        },
        {
          "artistid": "123482676",
          "name": "SIGMA",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/6/123482676.jpg"
        },
        {
          "artistid": "123483384",
          "name": "Seth Troxler",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/4/123483384_2.jpg"
        },
        {
          "artistid": "123468652",
          "name": "David Rodigan",
          "image": "https://d1mdxzfl9p8pzo.cloudfront.net/2/123468652_2.jpg"
        },
        {
          "artistid": "123498794",
          "name": "Wilkinson",
          "image": "https://d1mdxzfl9p8pzo.cloudfront.net/4/123498794_1.jpg"
        },
        {
          "artistid": "123459389",
          "name": "Skream",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/9/123459389_7.jpg"
        },
        {
          "artistid": "123457443",
          "name": "Sub Focus",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/3/123457443_1.jpg"
        },
        {
          "artistid": "123485218",
          "name": "Julio Bashmore",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/8/123485218_2.jpg"
        },
        {
          "artistid": "123485736",
          "name": "Heidi",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/6/123485736_1.jpg"
        },
        {
          "artistid": "123457391",
          "name": "Krysko",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/1/123457391_1.jpg"
        },
        {
          "artistid": "123458743",
          "name": "Adam Beyer",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/3/123458743_1.jpg"
        },
        {
          "artistid": "123457284",
          "name": "Mistajam",
          "image": "https://d1mdxzfl9p8pzo.cloudfront.net/4/123457284_2.jpg"
        }];
        
    $scope.moreTiles = [
        {
          "artistid": "123463568",
          "name": "Todd Terje",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/8/123463568.jpg"
        },
        {
          "artistid": "123499386",
          "name": "Nina Kraviz",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/6/123499386_1.jpg"
        },
        {
          "artistid": "807300",
          "name": "Groove Armada",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/0/807300.jpg"
        },
        {
          "artistid": "123457469",
          "name": "Steve Lawler",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/9/123457469.jpg"
        },
        {
          "artistid": "123456866",
          "name": "The Martinez Brothers",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/6/123456866.jpg"
        },
        {
          "artistid": "123497628",
          "name": "Maceo Plex",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/8/123497628_1.jpg"
        },
        {
          "artistid": "123462960",
          "name": "Lethal Bizzle",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/0/123462960.jpg"
        },
        {
          "artistid": "123490238",
          "name": "Jackmaster",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/8/123490238_1.jpg"
        },
        {
          "artistid": "123487912",
          "name": "Charlie Sloth",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/2/123487912.jpg"
        },
        {
          "artistid": "123474442",
          "name": "Friction",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/2/123474442_1.jpg"
        },
        {
          "artistid": "123470237",
          "name": "Dub Phizix",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/7/123470237_1.jpg"
        },
        {
          "artistid": "123499254",
          "name": "Eats Everything",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/4/123499254_2.jpg"
        },
        {
          "artistid": "123461352",
          "name": "Yousef",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/2/123461352.jpg"
        },
        {
          "artistid": "123457893",
          "name": "Kano",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/3/123457893.jpg"
        },
        {
          "artistid": "123459429",
          "name": "Ben UFO",
          "image": "https://d1mdxzfl9p8pzo.cloudfront.net/9/123459429_1.jpg"
        },
        {
          "artistid": "123482010",
          "name": "Ben Klock",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/0/123482010.jpg"
        },
        {
          "artistid": "123457973",
          "name": "Joy Orbison",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/3/123457973_1.jpg"
        },
        {
          "artistid": "123471530",
          "name": "Joris Voorn",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/0/123471530.jpg"
        },
        {
          "artistid": "123498738",
          "name": "Subb-An",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/8/123498738.jpg"
        },
        {
          "artistid": "123481760",
          "name": "The Chemical Brothers",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/0/123481760_1.jpg"
        },
        {
          "artistid": "123477344",
          "name": "Artwork",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/4/123477344.jpg"
        },
        {
          "artistid": "123471406",
          "name": "Logan Sama",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/6/123471406.jpg"
        },
        {
          "artistid": "123461398",
          "name": "Oneman",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/8/123461398_1.jpg"
        },
        {
          "artistid": "123499982",
          "name": "Floating Points",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/2/123499982.jpg"
        },
        {
          "artistid": "123457007",
          "name": "Tiga",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/7/123457007.jpg"
        },
        {
          "artistid": "123459607",
          "name": "Armand Van Helden",
          "image": "https://d1mdxzfl9p8pzo.cloudfront.net/7/123459607_10.jpg"
        },
        {
          "artistid": "123483408",
          "name": "Submotion Orchestra",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/8/123483408.jpg"
        },
        {
          "artistid": "123492274",
          "name": "KiNK",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/4/123492274_1.jpg"
        },
        {
          "artistid": "123487456",
          "name": "Alan Fitzpatrick",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/6/123487456.jpg"
        },
        {
          "artistid": "972643",
          "name": "Jamie Woon",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/3/972643.jpg"
        },
        {
          "artistid": "123487462",
          "name": "Ida Engberg",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/2/123487462.jpg"
        },
        {
          "artistid": "123484242",
          "name": "De La Soul",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/2/123484242.jpg"
        },
        {
          "artistid": "123456873",
          "name": "Riton",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/3/123456873.jpg"
        },
        {
          "artistid": "123485370",
          "name": "Busta Rhymes",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/0/123485370.jpg"
        },
        {
          "artistid": "123504694",
          "name": "Bicep",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/4/123504694.jpg"
        },
        {
          "artistid": "123504958",
          "name": "Dusky",
          "image": "https://d1mdxzfl9p8pzo.cloudfront.net/8/123504958_1.jpg"
        },
        {
          "artistid": "123505226",
          "name": "Danny Howard",
          "image": "https://d1mdxzfl9p8pzo.cloudfront.net/6/123505226_1.jpg"
        },
        {
          "artistid": "123507354",
          "name": "Gorgon City",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/4/123507354.jpg"
        },
        {
          "artistid": "123507440",
          "name": "Daniel Avery",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/0/123507440.jpg"
        },
        {
          "artistid": "123510164",
          "name": "My Nu Leng",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/4/123510164.jpg"
        },
        {
          "artistid": "123510426",
          "name": "Andrea Oliva",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/6/123510426.jpg"
        },
        {
          "artistid": "123510520",
          "name": "Hot Since 82",
          "image": "https://63ea9e190c1ae7969a79-8a13f6863a812b4418b1651cf80687cc.ssl.cf3.rackcdn.com/0/123510520.jpg"
        }
      ];
}

