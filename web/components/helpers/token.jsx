// maps character string to css token string
function getToken(character) {
    let token = '';
    if (character === 'colonel_mustard') { token = 'colonelMustard'; }
    else if (character === 'miss_scarlet') { token = 'missScarlet'; }
    else if (character === 'professor_plum') { token = 'professorPlum'; }
    else if (character === 'mr_green') { token = 'mrGreen'; }
    else if (character === 'mrs_white') { token = 'mrsWhite'; }
    else if (character === 'mrs_peacock') { token = 'mrsPeacock'; }
    return (token);
}
export default getToken;