function interpolate(points, threshold) {
    var result = [points[0]];  // Start with the first point

    for (var i = 0; i < points.length - 1; i++) {
        var p1 = points[i];
        var p2 = points[i + 1];

        // Calculate the Euclidean distance between the two points
        var dx = p2[0] - p1[0];
        var dy = p2[1] - p1[1];
        var dist = Math.sqrt(dx * dx + dy * dy);

        // If the distance is larger than the threshold, add interpolated points
        if (dist > threshold) {
            var numPoints = Math.ceil(dist / threshold);
            var stepX = dx / numPoints;
            var stepY = dy / numPoints;

            for (var j = 1; j < numPoints; j++) {
                var newX = p1[0] + j * stepX;
                var newY = p1[1] + j * stepY;
                result.push([newX, newY]);
            }
        }

        result.push(p2);  // Add the next point
    }

    return result;
}

// Example usage:
var points = [[0, 0], [1, 1], [3, 3]];
var threshold = 1;
console.log(interpolate(points, threshold));