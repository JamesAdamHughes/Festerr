angular.module('festerrApp').factory('FestivalDataService', function() {
    
    // TODO get this from the API
    var festivalData = [{
        name: "Parklife 2016",
        date: "26th July 2016",
        location: "Hampshire Road, Manchester",
        description: "Parklife Festival is a Mancunian institution of urban," +
            " electro, indie and pop music. In five short years it has built" +
            "up a near-legendary reputation that pulls in a unique and diverse lineup year after year.",
        layout: {
            // Size of the tile in the grid
            span: {
                row: 3,
                col: 8
            },
            backgroundColor: "#9585BE",
            backgroundImage: "http://quaysnews.net/wp-content/uploads/2016/02/PL_FB_AD_1.png"
        },
        artists: [{
            name: "The Chemical Brothers",
            layout: {
                span: {
                    row: 2,
                    col: 2
                },
                backgroundImage: "https://static-secure.guim.co.uk/sys-images/Observer/Columnist/Columnists/2015/7/24/1437753327251/the-chemical-brothers-009.jpg"
            }
        }, {
            name: "Major Lazer",
            layout: {
                span: {
                    row: 2,
                    col: 2
                },
                backgroundImage: "http://www.tribalmixes.com/pic/dj/new/major-lazer-1.jpg"
            }
        }]
    }, {
        name: "Strawberrys and Creem Festival",
        date: "26th July 2016",
        location: "Hampshire Road, Manchester",
        description: "Parklife Festival is a Mancunian institution of urban," +
            " electro, indie and pop music. In five short years it has built" +
            "up a near-legendary reputation that pulls in a unique and diverse lineup year after year.",
        layout: {
            // Size of the tile in the grid
            span: {
                row: 3,
                col: 8
            },
            backgroundColor: "#9585BE",
            backgroundImage: "https://d31fr2pwly4c4s.cloudfront.net/c/8/7/786794_0_strawberries-creem-festival_400.jpg"
        }
    }, {
        name: "Glastonbury 2016",
        date: "26th July 2016",
        location: "Hampshire Road, Manchester",
        description: "Parklife Festival is a Mancunian institution of urban," +
            " electro, indie and pop music. In five short years it has built" +
            "up a near-legendary reputation that pulls in a unique and diverse lineup year after year.",
        layout: {
            // Size of the tile in the grid
            span: {
                row: 3,
                col: 8
            },
            backgroundColor: "#9585BE",
            backgroundImage: "https://metrouk2.files.wordpress.com/2015/09/glastonbury-festival-2015-day-2.jpg?w=748&h=486&crop=1"
        }
    }];
;

    /*
        Returns the festivals data

        TODO call the api from here
        TODO allow for query paramters to refine the search
    */
    var getFestivalData = function() {
        return festivalData;
    }

    return {
        getFestivalData: getFestivalData
    }


 

});