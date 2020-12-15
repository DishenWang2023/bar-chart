const w = 1000
const h = 500
const padding = 40
const wRect = 3
const quarterList = [0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 3]

const firstFetch = async () => {
  var response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  } else {
    return await response
  }
}

firstFetch().then((res) => res.json())
  .then((dataSet) => {
    const gdpData = dataSet.data
    const xScale = d3.scaleLinear().domain([parseInt(dataSet.from_date.slice(0, 4)), parseInt(dataSet.to_date.slice(0, 4)) + quarterList[parseInt(dataSet.to_date.slice(5, 7))] * 0.25])
      .range([padding, w - padding - wRect])
    const yScale = d3.scaleLinear().domain([0, d3.max(gdpData, (d) => d[1])])
      .range([h - padding, padding])
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    document.getElementById("date").textContent = "From " + dataSet.from_date + " to " + dataSet.to_date

    const svg = d3.select(".wrapper")
      .append("svg")
      .attr("width", w)
      .attr("height", h)

    svg.selectAll("rect")
      .data(gdpData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(parseInt(d[0].slice(0, 4)) + (i % 4) * 0.25))
      .attr("y", (d, i) => yScale(d[1]))
      .attr("width", wRect)
      .attr("height", (d) => h - padding - yScale(d[1]))
      .attr("fill", "white")
      .attr("class", "bar")
      .append("title")
      .text((d) => d[0].slice(0, 4) + " Q" + (quarterList[parseInt(d[0].slice(5, 7))] + 1) + " $" + d[1] + " Billion")

    svg.append("g")
      .attr("transform", "translate(0, " + (h - padding) + ")")
      .call(xAxis)

    svg.append("g")
      .attr("transform", "translate(" +
        padding + ", 0)")
      .call(yAxis)

    d3.select(".wrapper")
      .append("p")
      .text(dataSet.description)
  })