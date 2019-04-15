<?php

$min = 15;
$max = 70;

$aAnimaux = [
    [
        'groupe' => 'domestiques',
        [
            'type' => 'chiens',
            'animaux' => ['petit' => mt_rand($min, $max), 'moyen' => mt_rand($min, $max),
                'grand' => mt_rand($min, $max), 'très grand' => mt_rand($min, $max) ]
        ],
        [
            'type' => 'chats',
            'animaux' => ['petit' => mt_rand($min, $max), 'moyen' => mt_rand($min, $max),
                'grand' => mt_rand($min, $max), 'très grand' => mt_rand($min, $max)]
        ],
        [
            'type' => 'moutons',
            'animaux' => ['petit' => mt_rand($min, $max), 'moyen' => mt_rand($min, $max),
                'grand' => mt_rand($min, $max), 'très grand' => mt_rand($min, $max)]
        ]
    ]
	,
    [
        'groupe' => 'sauvages',
        [
            'type' => 'loups',
            'animaux' => ['petit' => mt_rand($min, $max), 'moyen' => mt_rand($min, $max),
                'grand' => mt_rand($min, $max), 'très grand' => mt_rand($min, $max)]
        ],
        [
            'type' => 'tigres',
            'animaux' => ['petit' => mt_rand($min, $max), 'moyen' => mt_rand($min, $max),
                'grand' => mt_rand($min, $max), 'très grand' => mt_rand($min, $max)]
        ],
        [
            'type' => 'lions',
            'animaux' => ['petit' => mt_rand($min, $max), 'moyen' => mt_rand($min, $max),
                'grand' => mt_rand($min, $max), 'très grand' => mt_rand($min, $max) ]
        ],
        [
            'type' => 'renards',
            'animaux' => ['petit' => mt_rand($min, $max), 'moyen' => mt_rand($min, $max),
                'grand' => mt_rand($min, $max), 'très grand' => mt_rand($min, $max)]
        ],
        [
            'type' => 'gnous',
            'animaux' => ['petit' => mt_rand($min, $max), 'moyen' => mt_rand($min, $max),
                'grand' => mt_rand($min, $max), 'très grand' => mt_rand($min, $max)]
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