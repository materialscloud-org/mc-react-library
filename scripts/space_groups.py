import json

import pymatgen.symmetry.groups

# reverse the long-short mapping of the international (Hermann-Mauguin) in pymatgen
hm_short_to_long = pymatgen.symmetry.groups.SpaceGroup.abbrev_sg_mapping
hm_long_to_short = {}
for short, long in hm_short_to_long.items():
    hm_long_to_short[long] = short

# note: I confirmed that the pymatgen short notation matches with Bilbao
# (https://www.cryst.ehu.es/cgi-bin/cryst/programs/nph-table)

space_groups_info = {}
for i in range(1, 231):
    sg_symbol = pymatgen.symmetry.groups.sg_symbol_from_int_number(i)
    sg_obj = pymatgen.symmetry.groups.SpaceGroup(sg_symbol)
    sg_short = hm_long_to_short.get(sg_symbol, sg_symbol)
    pg = sg_obj.point_group

    space_groups_info[i] = {"sg_int": sg_symbol, "sg_int_short": sg_short, "pg_int": pg}

with open("./space_groups.json", "w") as f:
    json.dump(space_groups_info, f, indent=2, sort_keys=True)
