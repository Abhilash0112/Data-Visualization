 let votePercentageChart = new VotePercentageChart();

        let tileChart = new TileChart();
        this.activeYear = null;
        this.activeYear = 2016;
        let that = this;
        function updateYear(year) {
        that.activeYear = year;
        if (that.activeCountry !== null) {
            ElectoralVoteChart.update(that.activeYear);
            TrendChart.update(that.activeYear);
            YearChart.update(that.activeYear);
            VotePercentageChart.update(electionResult, that.activeYear);
            TileChart.update(electionResult, colorScale, that.activeYear);

        }
        }

        //load the data corresponding to all the election years
        //pass this data and instances of all the charts that update on year selection to yearChart's constructor
        d3.csv("data/yearwiseWinner.csv", function (error, electionWinners) {

            let dataArray = [], i=0;
            for(let iter of electionWinners)
            {
                let csv = "data/Year_Timeline_" + iter.YEAR + ".csv";
                 d3.csv(csv, function (error, electoralVoteChart) {
                            dataArray[i++] = {"YEAR": iter.YEAR, "data": electoralVoteChart};
                        });
            }
            let shiftChart = new TrendChart(electionWinners, dataArray);
            let electoralVoteChart = new ElectoralVoteChart(shiftChart);
            let yearChart = new YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners, shiftChart);
            yearChart.update();


        });