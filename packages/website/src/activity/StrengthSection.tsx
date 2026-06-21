import EmbeddedWrapper from "component/EmbeddedWrapper";
import { useActivityPage } from "./activityPageDataProvider";
import { TopRightSpinner } from "component/Spinner";
import Tile, { Wall } from "component/Tile";
import Expander from "component/Expander";
import { PiBarbell } from "react-icons/pi";
import Icon from "component/Icon";
import formatPercentageChange from "utils/formatPercentageChange";
import StripedList, { StripeElement } from "component/StripedList";
import { formatDuration, formatStartTime } from "./format";
import DurationBarChart from "./DurationBarChart";
import DurationAccumulationChart from "./DurationAccumulationChart";

export default function StrengthSection() {
  const { activity, loading } = useActivityPage();

  const trailing30 = {
    count: activity?.trailing30Days.strengthWorkouts?.count ?? 0,
    duration: activity?.trailing30Days.strengthWorkouts?.durationSeconds ?? 0,
    activeEnergyBurned:
      activity?.trailing30Days.strengthWorkouts?.activeEnergyBurned ?? 0,
    workouts: activity?.trailing30Days.strengthWorkouts?.workouts ?? [],
  };

  const previous30 = {
    count: activity?.previous30Days.strengthWorkouts?.count ?? 0,
    duration: activity?.previous30Days.strengthWorkouts?.durationSeconds ?? 0,
    activeEnergyBurned:
      activity?.previous30Days.strengthWorkouts?.activeEnergyBurned ?? 0,
  };

  return (
    <EmbeddedWrapper>
      <TopRightSpinner show={loading} />
      <div className="space-y-12">
        <Wall>
          <Tile>
            <Icon component={PiBarbell} />
            <strong>{trailing30.count}</strong> strength workouts lasting{" "}
            <strong>{formatDuration(trailing30.duration)}</strong> in the last
            30 days
            <br />
            <span className="text-xs">
              {formatPercentageChange(trailing30.duration, previous30.duration)}{" "}
              change on the previous 30 days
            </span>
          </Tile>
          <Tile>
            <Icon component={PiBarbell} />
            <strong>{trailing30.activeEnergyBurned}</strong> kcals burned in the
            last 30 days
            <br />
            <span className="text-xs">
              {formatPercentageChange(
                trailing30.activeEnergyBurned,
                previous30.activeEnergyBurned,
              )}{" "}
              change on the previous 30 days
            </span>
          </Tile>
        </Wall>
        <DurationBarChart
          data={{
            thisYear: activity?.thisYear.strengthWorkouts?.months ?? [],
            lastYear: activity?.lastYear.strengthWorkouts?.months ?? [],
          }}
        />
        <DurationAccumulationChart
          data={{
            thisYear: activity?.thisYear.strengthWorkouts?.days ?? [],
            lastYear: activity?.lastYear.strengthWorkouts?.days ?? [],
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
                    <Icon component={PiBarbell} />{" "}
                    {formatDuration(workout.durationSeconds)} -{" "}
                    {workout.activeEnergyBurned} kcals
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
