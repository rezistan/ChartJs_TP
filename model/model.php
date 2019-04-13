<?php

$aAnimaux = [

    [
        'groupe' => 'domestiques',
        [
            'type' => 'chiens',
            'animaux' => ['petit' => 45, 'moyen' => 50, 'grand' => 38, 'très grand' => 43 ]
        ],
        [
            'type' => 'chats',
            'animaux' => ['petit' => 29, 'moyen' => 33, 'grand' => 32, 'très grand' => 37]
        ],
        [
            'type' => 'moutons',
            'animaux' => ['petit' => 29, 'moyen' => 44, 'grand' => 55, 'très grand' => 56]
        ]
    ]
	,
    [
        'groupe' => 'sauvages',
        [
            'type' => 'loups',
            'animaux' => ['petit' => 29, 'moyen' => 44, 'grand' => 55, 'très grand' => 56]
        ],
        [
            'type' => 'tigres',
            'animaux' => ['petit' => 29, 'moyen' => 55, 'grand' => 99, 'très grand' => 37]
        ],
        [
            'type' => 'lions',
            'animaux' => ['petit' => 45, 'moyen' => 50, 'grand' => 38, 'très grand' => 43 ]
        ],
        [
            'type' => 'renards',
            'animaux' => ['petit' => 29, 'moyen' => 33, 'grand' => 32, 'très grand' => 37]
        ],
        [
            'type' => 'gnous',
            'animaux' => ['petit' => 29, 'moyen' => 15, 'grand' => 87, 'très grand' => 23]
        ]
    ]
];

foreach($aAnimaux as &$groupe){
    $totalGp = 0;
    foreach($groupe as $key=>&$type) {
        $total = 0;
        if($key!=='groupe'){
            foreach ($type['animaux'] as $nombre) {
                $total += $nombre;
            }
            $type['total'] = $total;
            $totalGp += $total;
        }
    }
    $groupe['total'] = $totalGp;
}

echo json_encode($aAnimaux);