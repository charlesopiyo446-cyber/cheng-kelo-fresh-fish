<?php
/**
 * Cheng Kello Fresh Fish — PHP REST API
 * Single-file router — avoids Apache directory-slash redirect issues
 */

// ── CORS ─────────────────────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (preg_match('#^http://localhost(:\d+)?$#', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── Helpers ───────────────────────────────────────────────────────────────────
function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $pdo = new PDO('mysql:host=localhost;dbname=cheng_kello;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
    return $pdo;
}
function ok(mixed $data, int $code = 200): void { http_response_code($code); echo json_encode($data); exit; }
function err(string $msg, int $code = 400): void { ok(['error' => $msg], $code); }
function body(): array { $d = json_decode(file_get_contents('php://input'), true); return is_array($d) ? $d : []; }
function method(): string { return $_SERVER['REQUEST_METHOD']; }

// ── Routing ───────────────────────────────────────────────────────────────────
$path     = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$parts    = explode('/', $path);
$apiPos   = array_search('api', $parts);
$resource = $apiPos !== false ? ($parts[$apiPos + 1] ?? '') : '';
$id       = $apiPos !== false ? ($parts[$apiPos + 2] ?? null) : null;
$resource = strtolower(trim($resource, '/'));

// ── AUTH ──────────────────────────────────────────────────────────────────────
if ($resource === 'auth') {
    if (method() !== 'POST') err('Method not allowed', 405);
    $b = body();
    if (empty($b['email']) || empty($b['password'])) err('Email and password required');
    $s = db()->prepare("SELECT * FROM users WHERE email = ? AND is_active = 1");
    $s->execute([$b['email']]);
    $user = $s->fetch();
    if (!$user || !password_verify($b['password'], $user['password'])) err('Invalid credentials', 401);
    unset($user['password']);
    ok(['user' => $user]);
}

// ── USERS ─────────────────────────────────────────────────────────────────────
if ($resource === 'users') {
    $cols = "id,name,email,role,phone,address,is_active,profile_picture,email_verified,password_change_required,created_at,updated_at";
    switch (method()) {
        case 'GET':
            if ($id) {
                $s = db()->prepare("SELECT $cols FROM users WHERE id=?"); $s->execute([$id]);
                $r = $s->fetch(); $r ? ok($r) : err('Not found', 404);
            }
            $role = $_GET['role'] ?? null;
            if ($role) { $s = db()->prepare("SELECT $cols FROM users WHERE role=? ORDER BY id"); $s->execute([$role]); }
            else        { $s = db()->query("SELECT $cols FROM users ORDER BY id"); }
            ok($s->fetchAll());
        case 'POST':
            $b = body();
            foreach (['name','email','password','role'] as $f) if (empty($b[$f])) err("$f required");
            if (!in_array($b['role'], ['admin','director','cashier','customer'])) err('Invalid role');
            $c = db()->prepare("SELECT id FROM users WHERE email=?"); $c->execute([$b['email']]);
            if ($c->fetch()) err('Email exists', 409);
            $s = db()->prepare("INSERT INTO users (name,email,password,role,phone,address,is_active,profile_picture,email_verified) VALUES (?,?,?,?,?,?,?,?,?)");
            $s->execute([$b['name'],$b['email'],password_hash($b['password'],PASSWORD_BCRYPT),$b['role'],$b['phone']??null,$b['address']??null,$b['is_active']??1,$b['profile_picture']??null,$b['email_verified']??0]);
            $s2 = db()->prepare("SELECT $cols FROM users WHERE id=?"); $s2->execute([db()->lastInsertId()]); ok($s2->fetch(), 201);
        case 'PUT':
            if (!$id) err('ID required');
            $b = body(); $fields=[]; $params=[];
            foreach (['name','email','role','phone','address','is_active','profile_picture','email_verified','password_change_required'] as $col)
                if (array_key_exists($col,$b)) { $fields[]="$col=?"; $params[]=$b[$col]; }
            if (!empty($b['password'])) { $fields[]="password=?"; $params[]=password_hash($b['password'],PASSWORD_BCRYPT); }
            if (!$fields) err('Nothing to update');
            $params[]=$id; db()->prepare("UPDATE users SET ".implode(',',$fields)." WHERE id=?")->execute($params);
            $s = db()->prepare("SELECT $cols FROM users WHERE id=?"); $s->execute([$id]); ok($s->fetch());
        case 'DELETE':
            if (!$id) err('ID required');
            db()->prepare("DELETE FROM users WHERE id=?")->execute([$id]); ok(['message'=>'Deleted']);
        default: err('Method not allowed', 405);
    }
}

// ── FISH CATEGORIES ───────────────────────────────────────────────────────────
if ($resource === 'fish_categories') {
    switch (method()) {
        case 'GET':
            if ($id) { $s=db()->prepare("SELECT * FROM fish_categories WHERE id=?"); $s->execute([$id]); $r=$s->fetch(); $r?ok($r):err('Not found',404); }
            $active = $_GET['active'] ?? null;
            if ($active!==null) { $s=db()->prepare("SELECT * FROM fish_categories WHERE is_active=? ORDER BY id"); $s->execute([(int)$active]); }
            else { $s=db()->query("SELECT * FROM fish_categories ORDER BY id"); }
            ok($s->fetchAll());
        case 'POST':
            $b=body(); if(empty($b['name'])||!isset($b['unit_price'])) err('name and unit_price required');
            $c=db()->prepare("SELECT id FROM fish_categories WHERE name=?"); $c->execute([strtoupper($b['name'])]);
            if($c->fetch()) err('Name exists',409);
            $s=db()->prepare("INSERT INTO fish_categories (name,description,unit_price,purchase_cost,image,is_active) VALUES (?,?,?,?,?,?)");
            $s->execute([strtoupper($b['name']),$b['description']??null,$b['unit_price'],$b['purchase_cost']??null,$b['image']??null,$b['is_active']??1]);
            $s2=db()->prepare("SELECT * FROM fish_categories WHERE id=?"); $s2->execute([db()->lastInsertId()]); ok($s2->fetch(),201);
        case 'PUT':
            if(!$id) err('ID required'); $b=body(); $fields=[]; $params=[];
            foreach(['name','description','unit_price','purchase_cost','image','is_active'] as $col)
                if(array_key_exists($col,$b)) { $fields[]="$col=?"; $params[]=$col==='name'?strtoupper($b[$col]):$b[$col]; }
            if(!$fields) err('Nothing to update');
            $params[]=$id; db()->prepare("UPDATE fish_categories SET ".implode(',',$fields)." WHERE id=?")->execute($params);
            $s=db()->prepare("SELECT * FROM fish_categories WHERE id=?"); $s->execute([$id]); ok($s->fetch());
        case 'DELETE':
            if(!$id) err('ID required');
            $c=db()->prepare("SELECT id FROM stocks WHERE fish_category_id=? LIMIT 1"); $c->execute([$id]);
            if($c->fetch()) err('Has stock records',409);
            db()->prepare("DELETE FROM fish_categories WHERE id=?")->execute([$id]); ok(['message'=>'Deleted']);
        default: err('Method not allowed',405);
    }
}

// ── STOCKS ────────────────────────────────────────────────────────────────────
if ($resource === 'stocks') {
    $sel = "SELECT s.*,fc.name AS category_name,fc.description AS category_description,fc.unit_price AS category_unit_price,u1.name AS added_by_name,u2.name AS approved_by_name FROM stocks s LEFT JOIN fish_categories fc ON fc.id=s.fish_category_id LEFT JOIN users u1 ON u1.id=s.added_by LEFT JOIN users u2 ON u2.id=s.approved_by";
    switch (method()) {
        case 'GET':
            if ($id) { $s=db()->prepare("$sel WHERE s.id=?"); $s->execute([$id]); $r=$s->fetch(); $r?ok($r):err('Not found',404); }
            $where=[]; $params=[];
            if (!empty($_GET['status']) && in_array($_GET['status'],['pending','approved','rejected'])) { $where[]="s.status=?"; $params[]=$_GET['status']; }
            if (!empty($_GET['category'])) { $where[]="s.fish_category_id=?"; $params[]=$_GET['category']; }
            $sql=$sel.($where?" WHERE ".implode(' AND ',$where):'')." ORDER BY s.id DESC";
            $s=db()->prepare($sql); $s->execute($params); ok($s->fetchAll());
        case 'POST':
            $b=body(); foreach(['fish_category_id','quantity','added_by','stock_date'] as $f) if(empty($b[$f])) err("$f required");
            $s=db()->prepare("INSERT INTO stocks (fish_category_id,quantity,cost_price,stock_date,status,added_by,notes) VALUES (?,?,?,'".($b['stock_date'])."','pending',?,?)");
            $s->execute([$b['fish_category_id'],$b['quantity'],$b['cost_price']??null,$b['added_by'],$b['notes']??null]);
            $s2=db()->prepare("$sel WHERE s.id=?"); $s2->execute([db()->lastInsertId()]); ok($s2->fetch(),201);
        case 'PUT':
            if(!$id) err('ID required'); $b=body();
            if(isset($b['action'])) {
                if(!in_array($b['action'],['approve','reject'])) err('Invalid action');
                if(empty($b['approved_by'])) err('approved_by required');
                $st=$b['action']==='approve'?'approved':'rejected';
                db()->prepare("UPDATE stocks SET status=?,approved_by=?,approved_at=NOW() WHERE id=?")->execute([$st,$b['approved_by'],$id]);
                $s=db()->prepare("$sel WHERE s.id=?"); $s->execute([$id]); ok($s->fetch());
            }
            $fields=[]; $params=[];
            foreach(['fish_category_id','quantity','cost_price','stock_date','status','notes'] as $col)
                if(array_key_exists($col,$b)) { $fields[]="$col=?"; $params[]=$b[$col]; }
            if(!$fields) err('Nothing to update');
            $params[]=$id; db()->prepare("UPDATE stocks SET ".implode(',',$fields)." WHERE id=?")->execute($params);
            $s=db()->prepare("$sel WHERE s.id=?"); $s->execute([$id]); ok($s->fetch());
        case 'DELETE':
            if(!$id) err('ID required');
            db()->prepare("DELETE FROM stocks WHERE id=?")->execute([$id]); ok(['message'=>'Deleted']);
        default: err('Method not allowed',405);
    }
}

// ── SALES ─────────────────────────────────────────────────────────────────────
if ($resource === 'sales') {
    $sel = "SELECT s.*,fc.name AS category_name,fc.description AS category_description,u.name AS sold_by_name FROM sales s LEFT JOIN fish_categories fc ON fc.id=s.fish_category_id LEFT JOIN users u ON u.id=s.sold_by";
    switch (method()) {
        case 'GET':
            if($id) { $s=db()->prepare("$sel WHERE s.id=?"); $s->execute([$id]); $r=$s->fetch(); $r?ok($r):err('Not found',404); }
            $s=db()->query("$sel ORDER BY s.id DESC"); ok($s->fetchAll());
        case 'POST':
            $b=body(); foreach(['fish_category_id','quantity','unit_price','sold_by','sale_date'] as $f) if(empty($b[$f])) err("$f required");
            $av=db()->prepare("SELECT COALESCE((SELECT SUM(quantity) FROM stocks WHERE fish_category_id=? AND status='approved'),0)-COALESCE((SELECT SUM(quantity) FROM sales WHERE fish_category_id=?),0) AS a");
            $av->execute([$b['fish_category_id'],$b['fish_category_id']]); $avail=(int)$av->fetchColumn();
            if((int)$b['quantity']>$avail) err("Insufficient stock. Available: $avail units",422);
            $total=(int)$b['quantity']*(float)$b['unit_price'];
            $s=db()->prepare("INSERT INTO sales (fish_category_id,quantity,unit_price,total_amount,sold_by,sale_date,customer_name,customer_phone,notes) VALUES (?,?,?,?,?,?,?,?,?)");
            $s->execute([$b['fish_category_id'],$b['quantity'],$b['unit_price'],$total,$b['sold_by'],$b['sale_date'],$b['customer_name']??null,$b['customer_phone']??null,$b['notes']??null]);
            $s2=db()->prepare("$sel WHERE s.id=?"); $s2->execute([db()->lastInsertId()]); ok($s2->fetch(),201);
        case 'PUT':
            if(!$id) err('ID required'); $b=body(); $fields=[]; $params=[];
            $cur=db()->prepare("$sel WHERE s.id=?"); $cur->execute([$id]); $current=$cur->fetch();
            foreach(['fish_category_id','quantity','unit_price','sale_date','customer_name','customer_phone','notes'] as $col)
                if(array_key_exists($col,$b)) { $fields[]="$col=?"; $params[]=$b[$col]; }
            if(isset($b['quantity'])||isset($b['unit_price'])) { $fields[]="total_amount=?"; $params[]=((int)($b['quantity']??$current['quantity']))*((float)($b['unit_price']??$current['unit_price'])); }
            if(!$fields) err('Nothing to update');
            $params[]=$id; db()->prepare("UPDATE sales SET ".implode(',',$fields)." WHERE id=?")->execute($params);
            $s=db()->prepare("$sel WHERE s.id=?"); $s->execute([$id]); ok($s->fetch());
        case 'DELETE':
            if(!$id) err('ID required');
            db()->prepare("DELETE FROM sales WHERE id=?")->execute([$id]); ok(['message'=>'Deleted']);
        default: err('Method not allowed',405);
    }
}

// ── PURCHASES ─────────────────────────────────────────────────────────────────
if ($resource === 'purchases') {
    $sel = "SELECT p.*,fc.name AS category_name,fc.description AS category_description,u.name AS created_by_name FROM purchases p LEFT JOIN fish_categories fc ON fc.id=p.fish_category_id LEFT JOIN users u ON u.id=p.created_by";
    switch (method()) {
        case 'GET':
            if($id) { $s=db()->prepare("$sel WHERE p.id=?"); $s->execute([$id]); $r=$s->fetch(); $r?ok($r):err('Not found',404); }
            $s=db()->query("$sel ORDER BY p.id DESC"); ok($s->fetchAll());
        case 'POST':
            $b=body(); foreach(['fish_category_id','quantity','cost_price','created_by','purchase_date'] as $f) if(empty($b[$f])) err("$f required");
            $total=(int)$b['quantity']*(float)$b['cost_price'];
            db()->beginTransaction();
            try {
                $s=db()->prepare("INSERT INTO purchases (fish_category_id,quantity,cost_price,total_cost,created_by,purchase_date,supplier_name,invoice_number,notes) VALUES (?,?,?,?,?,?,?,?,?)");
                $s->execute([$b['fish_category_id'],$b['quantity'],$b['cost_price'],$total,$b['created_by'],$b['purchase_date'],$b['supplier_name']??null,$b['invoice_number']??null,$b['notes']??null]);
                $pid=(int)db()->lastInsertId();
                db()->prepare("INSERT INTO stocks (fish_category_id,quantity,cost_price,stock_date,status,added_by,notes) VALUES (?,?,?,?,'pending',?,?)")
                   ->execute([$b['fish_category_id'],$b['quantity'],$b['cost_price'],$b['purchase_date'],$b['created_by'],'From Purchase: '.($b['supplier_name']??'')]);
                db()->commit();
                $s2=db()->prepare("$sel WHERE p.id=?"); $s2->execute([$pid]); ok($s2->fetch(),201);
            } catch(Exception $e) { db()->rollBack(); err('Transaction failed: '.$e->getMessage(),500); }
        case 'PUT':
            if(!$id) err('ID required'); $b=body(); $fields=[]; $params=[];
            $cur=db()->prepare("$sel WHERE p.id=?"); $cur->execute([$id]); $current=$cur->fetch();
            foreach(['fish_category_id','quantity','cost_price','purchase_date','supplier_name','invoice_number','notes'] as $col)
                if(array_key_exists($col,$b)) { $fields[]="$col=?"; $params[]=$b[$col]; }
            if(isset($b['quantity'])||isset($b['cost_price'])) { $fields[]="total_cost=?"; $params[]=((int)($b['quantity']??$current['quantity']))*((float)($b['cost_price']??$current['cost_price'])); }
            if(!$fields) err('Nothing to update');
            $params[]=$id; db()->prepare("UPDATE purchases SET ".implode(',',$fields)." WHERE id=?")->execute($params);
            $s=db()->prepare("$sel WHERE p.id=?"); $s->execute([$id]); ok($s->fetch());
        case 'DELETE':
            if(!$id) err('ID required');
            db()->prepare("DELETE FROM purchases WHERE id=?")->execute([$id]); ok(['message'=>'Deleted']);
        default: err('Method not allowed',405);
    }
}

err('Resource not found', 404);
