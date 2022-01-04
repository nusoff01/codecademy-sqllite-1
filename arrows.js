

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
            return [originX + (width / 
                2), originY];
        }
    }
    const coordinatesOrigin = getCoordinates(origin.node().getBoundingClientRect(), originPart);
    const coordinatesTarget = getCoordinates(target.node().getBoundingClientRect(), targetPart);

    const secondPoint = [coordinatesOrigin[0] + (originPart === 'left' ? -20 : 20), coordinatesOrigin[1]];
    const thirdPoint = [coordinatesTarget[0] + (targetPart === 'left' ? -20 : 20), coordinatesTarget[1]];
    return [coordinatesOrigin, secondPoint, thirdPoint, coordinatesTarget];
}

function getPaths () {
    return [
        [createPath(d3.select('#sql1-row1'), 'right', d3.select('#sql1-row3'), 'right'), 'CustomerId'],
        [createPath(d3.select('#sql1-row1'), 'right', d3.select('#sql1-row6'), 'left'), 'CustomerId'],
        [createPath(d3.select('#sql1-row2'), 'left', d3.select('#sql1-row4'), 'left'), 'OrderId'],
        [createPath(d3.select('#sql1-row5'), 'right', d3.select('#sql1-row7'), 'left'), 'ProductId'],
        [createPath(d3.select('#sql1-row7'), 'right', d3.select('#sql1-row9'), 'left'), 'ProductId'],
        [createPath(d3.select('#sql1-row8'), 'right', d3.select('#sql1-row10'), 'left'), 'SupplierId']
    ];
}

function render () {
    const svg = d3.select('#arrowsSvg');

    svg.attr('height', () => {
        const blockContainer = d3.select('.sql1-container').node();
        return `${Math.round(blockContainer.getBoundingClientRect().height)}`;
    });

    const arrowPaths = svg.selectAll('.sql1-arrowPath')
        .data(getPaths());
    arrowPaths.enter()
        .append('path')
        .attr('class', (d) => `sql1-arrowPath sql1-${d[1]}`)
        .merge(arrowPaths)
        .attr('d', d => d3.line().curve(d3.curveBasis)(d[0]))
        .attr('fill', 'none');
    arrowPaths.exit().remove();

    const joinedIds = ['CustomerId', 'OrderId', 'ProductId', 'SupplierId'];
    joinedIds.forEach((joinedId) => {
        d3.selectAll(`.sql1-${joinedId}`).on('mouseover', () => {
            d3.selectAll(`.sql1-${joinedId}`).classed('sql1-inFocus', true);
        }).on('mouseout', () => {
            d3.selectAll(`.sql1-${joinedId}`).classed('sql1-inFocus', false);
        });
    })
}

render();
d3.select(window).on('resize', () => {
    render();
});
