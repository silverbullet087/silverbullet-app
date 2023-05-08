import React from "react";
import "./ChartGrid.css";
import MonthlyExchangeProfitChart from "./MonthlyExchangeProfitChart";
import {Card, Dropdown} from "antd";
import {EllipsisOutlined} from "@ant-design/icons";
import Masonry from "react-masonry-css";

interface ChartGridProps {
}

// BookmarkGrid component
const ChartGrid: React.FC<ChartGridProps> = ({}) => {
    const breakpointColumnsObj = {
        default: 3,
        1100: 3,
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
