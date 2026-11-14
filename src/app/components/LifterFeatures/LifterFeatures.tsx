import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import styles from "./LifterFeatures.module.css";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import { LIFTER_FEATURES } from "@/app/constants/LifterFeatures";

export default function LifterFeatures() {
  return (
    <Box className={styles.lifterFeaturesRoot}>
      <DefaultHeading size="9" align="center" style={{ marginBottom: "1rem" }}>
        BUILT FOR LIFTERS
      </DefaultHeading>
      <Text size="5" align="center" style={{ marginBottom: "2.5rem", display: "block" }}>
        The ultimate toolkit for serious athletes to track, plan, and progress like never before.
      </Text>
      <Grid columns={{ initial: "1", md: "4" }} gap="6" justify="center">
        {LIFTER_FEATURES.map(({ title, description, icon: Icon }) => (
          <Box
            key={title}
            style={{
              minWidth: 240,
              padding: "3rem 1.5rem",
              height: "100%",
            }}
            className="card"
          >
            <Flex direction="column" gap="3">
              <Box
                style={{
                  width: 48,
                  height: 48,
                  background: "var(--accent-9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-contrast)"
                }}
              >
                <Icon color="var(--accent-contrast)" size={28} />
              </Box>
              <DefaultHeading size="7" style={{ margin: 0 }}>
                {title}
              </DefaultHeading>
              <Text size="4" color="gray">
                {description}
              </Text>
            </Flex>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
