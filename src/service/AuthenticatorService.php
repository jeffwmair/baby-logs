<?php

require_once(__DIR__."/../utils/credentials.php");

class AuthenticatorService {

	private $queryMapper;
	public function __construct($queryMapper) {
		$this->queryMapper = $queryMapper;
	}

	public static function validateSession() {
		if (!isset($_COOKIE['babyloggersession'])) {
			$urlprefix = getUrlPrefix();
			header('Location: '.$urlprefix.'signin.php');
			exit();
		}
	}

	public function authenticateTokenAgainstGoogle($token) {
		if ($token == null || $token == "") {
			throw new Exception("Bad token: $token");
		}

		$url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=".$token;
		$ch = curl_init("$url");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		$data = curl_exec($ch);
		$dataDecoded = json_decode($data);
		curl_close($ch);
		return $this->authenticateEmail($dataDecoded->email);
	}

	private function authenticateEmail($emailAddress) {
		// does it exist?
		$guardian = $this->queryMapper->getGuardianByEmailAddress($emailAddress);
		return isset($guardian);
	}
}
