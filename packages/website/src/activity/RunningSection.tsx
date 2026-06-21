import EmbeddedWrapper from "component/EmbeddedWrapper";
import { useActivityPage } from "./activityPageDataProvider";
import { TopRightSpinner } from "component/Spinner";
import Tile, { Wall } from "component/Tile";
import Expander from "component/Expander";
import { RiRunLine } from "react-icons/ri";
import Icon from "component/Icon";
import formatPercentageChange from "utils/formatPercentageChange";
import StripedList, { StripeElement } from "component/StripedList";
import { formatDuration, formatStartTime, formatKm } from "./format";
import DistanceBarChart from "./DistanceBarChart";
import DistanceAccumulationChart from "./DistanceAccumulationChart";
import RunSpeedChart from "./RunSpeedChart";
export default function RunningSection() {
  const { activity, loading } = useActivityPage();

  const trailing30 = {
    count: activity?.trailing30Days.runningWorkouts?.count ?? 0,
    duration: activity?.trailing30Days.runningWorkouts?.durationSeconds ?? 0,
    distance: activity?.trailing30Days.runningWorkouts?.distance?.km ?? 0,
    workouts: activity?.trailing30Days.runningWorkouts?.workouts ?? [],
  };

  const previous30 = {
    count: activity?.previous30Days.runningWorkouts?.count ?? 0,
    duration: activity?.previous30Days.runningWorkouts?.durationSeconds ?? 0,
    distance: activity?.previous30Days.runningWorkouts?.distance?.km ?? 0,
  };

  return (
    <EmbeddedWrapper>
      <TopRightSpinner show={loading} />
      <div className="space-y-12">
        <Wall>
          <Tile>
            <Icon component={RiRunLine} />
            <strong>{trailing30.count}</strong> runs lasting{" "}
            <strong>{formatDuration(trailing30.duration)}</strong> in the last
            30 days
            <br />
            <span className="text-xs">
              {formatPercentageChange(trailing30.duration, previous30.duration)}{" "}
              change on the previous 30 days
            </span>
          </Tile>
          <Tile>
            <Icon component={RiRunLine} />
            <strong>{formatKm(trailing30.distance)}</strong> run in the last 30
            days
            <br />
            <span className="text-xs">
              {formatPercentageChange(trailing30.distance, previous30.distance)}{" "}
              change on the previous 30 days
            </span>
          </Tile>
        </Wall>
        <DistanceBarChart
          data={{
            thisYear: (activity?.thisYear.runningWorkouts?.months ?? []).map(
              (m) => ({ month: m.month, km: m.distance?.km ?? 0 }),
            ),
            lastYear: (activity?.lastYear.runningWorkouts?.months ?? []).map(
              (m) => ({ month: m.month, km: m.distance?.km ?? 0 }),
            ),
          }}
        />
        <DistanceAccumulationChart
          data={{
            thisYear: (activity?.thisYear.runningWorkouts?.days ?? []).map(
              (d) => ({ date: d.date, km: d.distance?.km ?? 0 }),
            ),
            lastYear: (activity?.lastYear.runningWorkouts?.days ?? []).map(
              (d) => ({ date: d.date, km: d.distance?.km ?? 0 }),
            ),
          }}
        />
        <RunSpeedChart
          data={{
            thisYear: (activity?.thisYear.runningWorkouts?.months ?? []).map(
              ({ month, speed }) => ({ month, spm: speed?.spm }),
            ),
            lastYear: (activity?.lastYear.runningWorkouts?.months ?? []).map(
              ({ month, speed }) => ({ month, spm: speed?.spm }),
            ),
          }}
        />
        <Expander text="Recent Workouts">
          <StripedList>
            {trailing30.workouts.toReversed().map((workout) => (
              <StripeElement key={workout.startTime}>
                <div>
                  <div className="font-bold">
                    {formatStartTime(workout.startTime)}
                  </div>
                  <div>
                    <Icon component={RiRunLine} />{" "}
                    {formatDuration(workout.durationSeconds)} -{" "}
                    {formatKm(workout.distance?.km ?? 0)}
                  </div>
                </div>
              </StripeElement>
            ))}
          </StripedList>
        </Expander>
      </div>
    </EmbeddedWrapper>
  );
}
