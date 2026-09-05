import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, Line, Pattern, Rect } from "react-native-svg";

// Approximates the design's `repeating-linear-gradient(135deg, transparent 0 9px,
// rgba(255,255,255,.14) 9px 18px)` diagonal hatch for incomplete blocks.
export function HatchOverlay() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <Pattern id="hatch" patternUnits="userSpaceOnUse" width={18} height={18} patternTransform="rotate(45)">
          <Rect x={0} y={0} width={18} height={18} fill="transparent" />
          <Line x1={0} y1={0} x2={0} y2={18} stroke="rgba(255,255,255,0.14)" strokeWidth={9} />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#hatch)" />
    </Svg>
  );
}
