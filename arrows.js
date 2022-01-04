function initializeArrowDef (svg) {
    const markerBoxWidth = 10;
    const markerBoxHeight = 10;
    const refX = markerBoxWidth;
    const refY = markerBoxHeight / 2;
    const arrowPoints = [[0, 0], [0, 10], [10, 5]];

    svg.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .attr('stroke', 'rgb(16, 22, 47)')
        .attr('fill', 'rgb(16, 22, 47)');
}

function createPath (origin, originPart, target, targetPart) {
    // offset from upper left corner to the part where arrow should actually be
    const getCoordinates = (boundingRect, location) => {
        const originX = boundingRect.left;
        const originY = boundingRect.top;
        const width = boundingRect.width;
        const height = boundingRect.height;
        if (location === 'right') {
            return [originX + width, originY + (height / 2)];
        }
        if (location === 'left') {
            return [originX, originY + (height / 2)];
        }
        if (location === 'top') {
            return [originX + (width / 2), originY];
        }
    }
    const coordinatesOrigin = getCoordinates(origin.node().getBoundingClientRect(), originPart);
    const coordinatesTarget = getCoordinates(target.node().getBoundingClientRect(), targetPart);
    // if on the same y axis
    if (coordinatesOrigin[1] === coordinatesTarget[1]) {
        return [coordinatesOrigin, coordinatesTarget];
    }
    // if going from lower to higher
    if (coordinatesOrigin[1] > coordinatesTarget[1]) {
        return [coordinatesOrigin, [coordinatesOrigin[0], coordinatesTarget[1]], coordinatesTarget];
    }
    // if going from higher to lower
    return [coordinatesOrigin, [coordinatesTarget[0], coordinatesOrigin[1]], coordinatesTarget];
}

function getPaths () {
    return [
        createPath(d3.select('.mi-block1'), 'right', d3.select('.mi-block2'), 'left'),
        createPath(d3.select('.mi-block2'), 'right', d3.select('.mi-block3'), 'left'),
        createPath(d3.select('.mi-block3'), 'top', d3.select('.mi-block4'), 'right'),
        createPath(d3.select('.mi-block4'), 'left', d3.select('.mi-block2'), 'top'),
        createPath(d3.select('.mi-block3'), 'right', d3.select('.mi-block5'), 'left')
    ];
}

function render () {
    const svg = d3.select('#arrowsSvg');
    if (svg.selectAll('defs').empty()) {
        initializeArrowDef(svg);
    }

    svg.attr('height', () => {
        const blockContainer = d3.select('.mi-blockContainer').node();
        return `${Math.round(blockContainer.getBoundingClientRect().height)}`;
    });

    const arrowPaths = svg.selectAll('.mi-arrowPath')
        .data(getPaths());
    arrowPaths.enter()
        .append('path')
        .attr('class', 'mi-arrowPath')
        .merge(arrowPaths)
        .attr('d', pathCoords => d3.line()(pathCoords))
        .attr('stroke', 'grey')
        .attr('marker-end', 'url(#arrow)')
        .attr('fill', 'none');
    arrowPaths.exit().remove();
}

d3.selectAll('.mi-block')
    .on('click', function (d, i) {
        d3.selectAll('.mi-block')
            .classed('mi-selectedBlock', (d, currI) => i === currI ? true : false);
        const text = d3.select(this).select('h3').text().trim();
        setText(text);
        render();
    });

setText(Object.keys(textDict)[0]);
render();
d3.select(window).on('resize', () => {
    render();
})
