export default /*glsl */ `

attribute float aSize;
attribute float aTimeMultiplier;
attribute vec3 aColor;

uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

varying vec3 vColor;


float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}



void main()
{

    vec3 newPosition = position;


    float progress = uProgress * aTimeMultiplier;
    //Calculate different uProgress for animation
    //Exploding
    float explodingProgress = remap(progress, 0.0,0.1,0.0,1.0);
    explodingProgress=clamp(explodingProgress, 0.0,1.0);
    //animation fast at the beginning and to slow down before reaching the end
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition *=explodingProgress;


    //Falling
    float fallingProgress = remap(progress, 0.1,1.0,0.0,1.0);
    fallingProgress = clamp(fallingProgress,0.0,1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -=fallingProgress*0.2;

    //Scaling
    float openScalingProgress = remap(progress, 0.0,0.125,0.0,1.0);
    float closeScalingProgress = remap(progress, 0.125,1.0,1.0,0.0);
    float scalingProgress = min(openScalingProgress, closeScalingProgress);
    scalingProgress = clamp(scalingProgress,0.0,1.0);

    // Twinkling
    float twinklingProgress = remap(progress, 0.2,0.8,0.0,1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0,1.0);

    //sin -1 1 for 0 1 need to multiply 0.5 and add 0.5
    float sizeTwinkling = sin(progress*30.0)*0.5+0.5;
    sizeTwinkling = 1.0 - sizeTwinkling * twinklingProgress;


    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    

    gl_Position = projectionPosition;


    vColor = aColor;
 
    // Final size
    gl_PointSize = uSize * uResolution.y * aSize * scalingProgress * sizeTwinkling;
    gl_PointSize *= 1.0 / - viewPosition.z;
 
    if(gl_PointSize < 1.0)
        gl_Position = vec4(9999.9);
    
} `;
