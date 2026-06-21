import EmbeddedWrapper from "component/EmbeddedWrapper";
import { TopRightSpinner } from "component/Spinner";
import Tile, { Wall } from "component/Tile";
import DistanceBarChart from "./DistanceBarChart";
import DistanceAccumulationChart from "./DistanceAccumulationChart";
import { useActivityPage } from "./activityPageDataProvider";
import DistanceTile from "./DistanceTile";
import Expander from "component/Expander";
import { ACTIVITY_TYPE_CONFIG } from "./activityTypes";
import Icon from "component/Icon";
import { formatDuration, formatKm, formatStartTime } from "./format";
import StripedList, { StripeElement } from "component/StripedList";
import formatPercentageChange from "utils/formatPercentageChange";
import SwimSpeedChart from "./SwimSpeedChart";

export default function SwimmingSection() {
  const { activity, loading } = useActivityPage();

  return (
    <EmbeddedWrapper>
      <TopRightSpinner show={loading} />
      <div className="space-y-12">
        <Wall>
          <DistanceTile
            icon={ACTIVITY_TYPE_CONFIG.swimming.icon}
            verb={ACTIVITY_TYPE_CONFIG.swimming.verb}
            period="trailing30"
            km={activity?.trailing30Days.swimmingDistance.km}
            lastYearKm={activity?.lastYearTrailing30Days.swimmingDistance.km}
          />
          <DistanceTile
            icon={ACTIVITY_TYPE_CONFIG.swimming.icon}
            verb={ACTIVITY_TYPE_CONFIG.swimming.verb}
            period="year"
            km={activity?.thisYear.swimmingDistance.km}
            lastYearKm={activity?.lastYearToDate.swimmingDistance.km}
          />
        </Wall>
        <DistanceBarChart
          data={{
            thisYear: activity?.thisYear.swimmingDistance.months ?? [],
            lastYear: activity?.lastYear.swimmingDistance.months ?? [],
          }}
        />
        <DistanceAccumulationChart
          data={{
            thisYear: activity?.thisYear.swimmingDistance.days ?? [],
            lastYear: activity?.lastYear.swimmingDistance.days ?? [],
          }}
        />
        <Wall>
          <Tile>
            <Icon component={ACTIVITY_TYPE_CONFIG.swimming.icon} />
            <strong>
              {formatDuration(
                (activity?.trailing30Days.swimWorkouts?.speed?.spm ?? 0) * 100,
              )}
            </strong>{" "}
            per 100m average in the last 30 days <br />
            <span className="text-xs">
              speed{" "}
              {formatPercentageChange(
                activity?.trailing30Days.swimWorkouts?.speed?.mps ?? 0,
                activity?.previous30Days.swimWorkouts?.speed?.mps ?? 0,
              )}{" "}
              verses previous 30 days
            </span>
          </Tile>
          <Tile>
            <Icon component={ACTIVITY_TYPE_CONFIG.swimming.icon} />
            <strong>
              {activity?.trailing30Days.swimWorkouts?.activeEnergyBurned ?? 0}{" "}
              kcals
            </strong>{" "}
            burned in the last 30 days <br />
            <span className="text-xs">
              {formatPercentageChange(
                activity?.trailing30Days.swimWorkouts?.activeEnergyBurned ?? 0,
                activity?.previous30Days.swimWorkouts?.activeEnergyBurned ?? 0,
              )}{" "}
              change on the previous 30 days
            </span>
          </Tile>
        </Wall>
        <SwimSpeedChart
          data={{
            thisYear:
              activity?.thisYear.swimWorkouts?.months.map(
                ({ month, speed }) => ({ month, spm: speed?.spm }),
              ) ?? [],
            lastYear:
              activity?.lastYear.swimWorkouts?.months.map(
                ({ month, speed }) => ({ month, spm: speed?.spm }),
              ) ?? [],
          }}
        />
        <Expander text="Recent Swims">
          <StripedList>
            {activity?.trailing30Days.swimWorkouts?.workouts
              .toReversed()
              .map((workout) => (
                <StripeElement key={workout.startTime}>
                  <div>
                    <div className="font-bold">
                      {formatStartTime(workout.startTime)}
                    </div>
                    <div>
                      <Icon component={ACTIVITY_TYPE_CONFIG.swimming.icon} />{" "}
                      {formatDuration(workout.speed!.spm * 100)} per 100m{" "}
                      <span className="text-xs">
                        ({formatKm(workout.distance!.km)} in{" "}
                        {formatDuration(workout.durationSeconds)})
                      </span>
                    </div>
                  </div>
                </StripeElement>
              )) ?? []}
          </StripedList>
        </Expander>
      </div>
    </EmbeddedWrapper>
  );
}
