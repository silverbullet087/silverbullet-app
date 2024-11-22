import React from "react";
import "./ChartGrid.css";
import MonthlyExchangeProfitChart from "./MonthlyExchangeProfitChart";
import {Card} from "antd";
import Masonry from "react-masonry-css";
import MonthlyProfitAndReturnChart from "./MonthlyProfitAndReturnChart";
import StockCumulativeDividendChart from "./StockCumulativeDividendChart";
import StockYearlyCumulativeDividendChart from "./StockYearlyCumulativeDividendChart";
import ProfitRateChartByExchangeRate from "./ProfitRateChartByExchangeRate";
import MonthlyExchangeHistoryChart from "./MonthlyExchangeHistoryChart";
import PortfolioTop5ReturnChart from "./PortfolioTop5ReturnChart";
import StockReturnRateChart from "./StockReturnRateChart";
import SectorReturnRateChart from "./SectorReturnRateChart";

interface ChartGridProps {
}

// BookmarkGrid component
const ChartGrid: React.FC<ChartGridProps> = ({}) => {
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 2,
        500: 1
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            <Card
                // size="small"
                title={'월별 환차익 수익률 차트'}
                style={{
                    width: "100%",
                    marginBottom: 16,
                }}
            >
                <MonthlyExchangeProfitChart/>
            </Card>
            <Card
                // size="small"
                title={'월별 수익금 월별 수익률 차트'}
                style={{
                    width: "100%",
                    marginBottom: 16,
                }}
            >
                <MonthlyProfitAndReturnChart/>
            </Card>
            <Card
                // size="small"
                title={'종목별 누적배당금 차트'}
                style={{
                    width: "100%",
                    marginBottom: 16,
                }}
            >
                <StockCumulativeDividendChart/>
            </Card>
            <Card
                // size="small"
                title={'종목별 년도별 누적배당금 차트'}
                style={{
                    width: "100%",
                    marginBottom: 16,
                }}
            >
                <StockYearlyCumulativeDividendChart/>
            </Card>
            <Card
                // size="small"
                title={'환율 변동에 따른 수익률 차트'}
                style={{
                    width: "100%",
                    marginBottom: 16,
                }}
            >
                <ProfitRateChartByExchangeRate/>
            </Card>
            <Card
                // size="small"
                title={'월별 환전 이력 차트'}
                style={{
                    width: "100%",
                    marginBottom: 16,
                }}
            >
                <MonthlyExchangeHistoryChart/>
            </Card>
            <Card
                // size="small"
                title={'포트폴리오 종목별 수익률 순위 차트(TOP 5)'}
                style={{
                    width: "100%",
                    marginBottom: 16,
                }}
            >
                <PortfolioTop5ReturnChart/>
            </Card>
            <Card
                // size="small"
                title={'종목별 수익률 차트'}
                style={{
                    width: "100%",
                    marginBottom: 16,
                }}
            >
                <StockReturnRateChart/>
            </Card>
            <Card
                // size="small"
                title={'섹터별 수익률 차트'}
                style={{
                    width: "100%",
                    marginBottom: 16,
                }}
            >
                <SectorReturnRateChart/>
            </Card>









            {/*<Card*/}
            {/*    // size="small"*/}
            {/*    title={'월별 환차익 수익률 차트'}*/}
            {/*    style={{*/}
            {/*        width: "100%",*/}
            {/*        marginBottom: 16,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <MonthlyExchangeProfitChart/>*/}
            {/*</Card>*/}
            {/*<Card*/}
            {/*    // size="small"*/}
            {/*    title={'월별 환차익 수익률 차트'}*/}
            {/*    style={{*/}
            {/*        width: "100%",*/}
            {/*        marginBottom: 16,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <MonthlyExchangeProfitChart/>*/}
            {/*</Card>*/}
            {/*<Card*/}
            {/*    // size="small"*/}
            {/*    title={'월별 환차익 수익률 차트'}*/}
            {/*    style={{*/}
            {/*        width: "100%",*/}
            {/*        marginBottom: 16,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <MonthlyExchangeProfitChart/>*/}
            {/*</Card>*/}
            {/*<Card*/}
            {/*    // size="small"*/}
            {/*    title={'월별 환차익 수익률 차트'}*/}
            {/*    style={{*/}
            {/*        width: "100%",*/}
            {/*        marginBottom: 16,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <MonthlyExchangeProfitChart/>*/}
            {/*</Card>*/}
            {/*<Card*/}
            {/*    // size="small"*/}
            {/*    title={'월별 환차익 수익률 차트'}*/}
            {/*    style={{*/}
            {/*        width: "100%",*/}
            {/*        marginBottom: 16,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <MonthlyExchangeProfitChart/>*/}
            {/*</Card>*/}

        </Masonry>
    );
};

export default ChartGrid;
