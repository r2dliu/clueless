
const formatLabel = function (label) {
    // capitalize and add a space for suspect/room/weapon labels
    return label
        .split(/_/g)
        .map((word) => {
            return word[0].toUpperCase() + word.substring(1);
        })
        .join(" ");

}
export default formatLabel;